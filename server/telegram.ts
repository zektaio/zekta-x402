import TelegramBot from 'node-telegram-bot-api';
import { priceOracle } from './priceOracle';
import { SimpleSwapClient } from './simpleswap';
import { storage } from './storage';

interface UserSession {
  userId: number;
  currentFlow: 'idle' | 'swap';
  step: number;
  data: {
    currencyFrom?: string;
    currencyTo?: string;
    chainFrom?: string;
    chainTo?: string;
    amount?: string;
    addressTo?: string;
    orderId?: string;
  };
  swapHistory: Array<{
    orderId: string;
    from: string;
    to: string;
    amount: string;
    timestamp: number;
    status: string;
  }>;
}

const sessions = new Map<number, UserSession>();

let botInstance: TelegramBot | null = null;

export async function cleanupExistingBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  if (botInstance) {
    try {
      botInstance.removeAllListeners();
      await botInstance.stopPolling({ cancel: true });
      botInstance = null;
    } catch (e) {
      // Ignore cleanup errors
    }
  }

  try {
    const tempBot = new TelegramBot(token, { polling: false });
    await tempBot.deleteWebHook();
    const updates = await tempBot.getUpdates({ offset: -1, limit: 1 });
    if (updates.length > 0) {
      await tempBot.getUpdates({ offset: updates[0].update_id + 1, limit: 1 });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (e) {
    // Ignore flush errors
  }
}

const POPULAR_TOKENS = [
  { ticker: 'SOL', name: 'Solana', chain: 'solana' },
  { ticker: 'BTC', name: 'Bitcoin', chain: 'bitcoin' },
  { ticker: 'ETH', name: 'Ethereum', chain: 'ethereum' },
  { ticker: 'USDT', name: 'Tether', chain: 'ethereum' },
  { ticker: 'USDC', name: 'USD Coin', chain: 'ethereum' },
  { ticker: 'BNB', name: 'BNB', chain: 'bsc' },
  { ticker: 'MATIC', name: 'Polygon', chain: 'polygon' },
  { ticker: 'AVAX', name: 'Avalanche', chain: 'avalanche' },
  { ticker: 'ZEC', name: 'Zcash', chain: 'zcash' }
];

const CHAIN_TO_NETWORK: Record<string, string> = {
  'ethereum': 'eth',
  'bsc': 'bsc',
  'polygon': 'matic',
  'solana': 'sol',
  'avalanche': 'avaxc',
  'arbitrum': 'arbitrum',
  'optimism': 'optimism',
  'base': 'base',
  'tron': 'trx',
  'bitcoin': 'btc',
  'zcash': 'zec'
};

function getSession(userId: number): UserSession {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      userId,
      currentFlow: 'idle',
      step: 0,
      data: {},
      swapHistory: []
    });
  }
  return sessions.get(userId)!;
}

function validateAddress(address: string, chain: string): boolean {
  const evmRegex = /^0x[a-fA-F0-9]{40}$/;
  const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  const bitcoinRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/;
  const tronRegex = /^T[a-zA-Z0-9]{33}$/;
  const zcashRegex = /^(t1|t3)[a-zA-Z0-9]{33,34}$/;

  const evmChains = ['ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 'optimism', 'base'];
  
  if (evmChains.includes(chain)) {
    return evmRegex.test(address);
  } else if (chain === 'solana') {
    return solanaRegex.test(address);
  } else if (chain === 'bitcoin') {
    return bitcoinRegex.test(address);
  } else if (chain === 'tron') {
    return tronRegex.test(address);
  } else if (chain === 'zcash') {
    return zcashRegex.test(address);
  }
  
  return true;
}

export async function initializeTelegramBot(simpleSwapClient: SimpleSwapClient | null) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    console.log('⚠️ TELEGRAM_BOT_TOKEN not found, bot disabled');
    return null;
  }

  const bot = new TelegramBot(token, { 
    polling: true
  });

  bot.on('polling_error', (error: any) => {
    if (error.code === 'ETELEGRAM' && error.message.includes('409')) {
      return;
    }
    console.error('Bot polling error:', error);
  });

  botInstance = bot;
  console.log('✅ Telegram bot initialized');

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const session = getSession(msg.from!.id);
    session.currentFlow = 'idle';
    session.step = 0;

    const welcomeCaption = `Welcome to ZEKTA SWAP BOT

Your privacy first crypto swap assistant powered by Zero Knowledge technology

Available Commands
/swap - Create anonymous swap
/status - Check swap status
/history - View your swaps
/help - Get help

Powered by Zekta Protocol`;

    try {
      await bot.sendAnimation(chatId, './attached_assets/ezgif-1a20717b3708e4_1760734395810.gif', {
        caption: welcomeCaption
      });
    } catch (error: any) {
      await bot.sendMessage(chatId, welcomeCaption);
    }
  });

  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    
    const helpMessage = `Zekta Swap Bot Commands

🔄 /swap - Start a new swap
Follow the steps to swap any crypto anonymously

📊 /status [orderId] - Check order status
Example: /status ABC123XYZ

📜 /history - View your swap history
See all your previous swaps

Need help? Join our Telegram @zektaswapbot`;

    await bot.sendMessage(chatId, helpMessage);
  });

  bot.onText(/\/history/, async (msg) => {
    const chatId = msg.chat.id;
    const session = getSession(msg.from!.id);

    if (session.swapHistory.length === 0) {
      await bot.sendMessage(chatId, '📜 No swap history yet\n\nUse /swap to create your first swap!');
      return;
    }

    let historyMessage = '📜 Your Swap History\n\n';
    
    session.swapHistory.slice(-5).reverse().forEach((swap) => {
      const statusEmoji = swap.status === 'finished' ? '✅' : '🔄';
      const timeAgo = Math.floor((Date.now() - swap.timestamp) / 60000);
      const timeStr = timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`;
      
      historyMessage += `${statusEmoji} ${swap.orderId}\n   ${swap.amount} ${swap.from} → ${swap.to}\n   ${timeStr}\n\n`;
    });

    historyMessage += `Total Swaps: ${session.swapHistory.length}`;

    await bot.sendMessage(chatId, historyMessage);
  });

  bot.onText(/\/swap/, async (msg) => {
    const chatId = msg.chat.id;
    const session = getSession(msg.from!.id);
    
    session.currentFlow = 'swap';
    session.step = 1;
    session.data = {};

    const tokenRows = [];
    for (let i = 0; i < POPULAR_TOKENS.length; i += 2) {
      const row = [
        { text: `${POPULAR_TOKENS[i].ticker} ${POPULAR_TOKENS[i].name}`, callback_data: `from_${POPULAR_TOKENS[i].ticker}_${POPULAR_TOKENS[i].chain}` }
      ];
      if (POPULAR_TOKENS[i + 1]) {
        row.push({ text: `${POPULAR_TOKENS[i + 1].ticker} ${POPULAR_TOKENS[i + 1].name}`, callback_data: `from_${POPULAR_TOKENS[i + 1].ticker}_${POPULAR_TOKENS[i + 1].chain}` });
      }
      tokenRows.push(row);
    }

    const keyboard = { inline_keyboard: tokenRows };

    await bot.sendMessage(chatId, `🔄 Create Your Swap\n\nStep 1 of 5: Select SOURCE token`, {
      reply_markup: keyboard
    });
  });

  bot.onText(/\/status(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const orderId = match?.[1]?.trim();

    if (!orderId) {
      await bot.sendMessage(chatId, '⚠️ Please provide an order ID\n\nUsage: /status ABC123XYZ');
      return;
    }

    if (!simpleSwapClient) {
      await bot.sendMessage(chatId, '⚠️ Swap service not available. Please contact support.');
      return;
    }

    try {
      const exchange = await simpleSwapClient.getExchange(orderId);
      
      const statusEmoji = {
        'waiting': '⏳',
        'confirming': '🔄',
        'exchanging': '🔄',
        'sending': '📤',
        'finished': '✅',
        'failed': '❌',
        'refunded': '↩️',
        'expired': '⏱️'
      }[exchange.status] || '❓';

      const statusMessage = `📊 Swap Status

Order: ${orderId}
Status: ${statusEmoji} ${exchange.status}

From: ${exchange.amountFrom} ${exchange.tickerFrom || exchange.currencyFrom}
To: ${exchange.amountTo || exchange.expectedAmount || 'Calculating...'} ${exchange.tickerTo || exchange.currencyTo}
Address: ${exchange.addressTo}

Updates every 30 seconds`;

      await bot.sendMessage(chatId, statusMessage);
    } catch (error: any) {
      const sanitizedError = error.message
        ?.replace(/SimpleSwap/gi, 'exchange service')
        ?.replace(/Replit/gi, 'platform')
        ?.replace(/API error/gi, 'service error') || 'Order not found';
      await bot.sendMessage(chatId, `❌ Error: ${sanitizedError}`);
    }
  });

  bot.on('callback_query', async (query) => {
    const chatId = query.message!.chat.id;
    const session = getSession(query.from.id);
    const data = query.data!;

    await bot.answerCallbackQuery(query.id);

    if (data.startsWith('from_')) {
      const [, ticker, chain] = data.split('_');
      session.data.currencyFrom = ticker;
      session.data.chainFrom = chain;
      session.step = 2;

      const filteredTokens = POPULAR_TOKENS.filter(t => t.ticker !== ticker);
      const tokenRows = [];
      for (let i = 0; i < filteredTokens.length; i += 2) {
        const row = [
          { text: `${filteredTokens[i].ticker} ${filteredTokens[i].name}`, callback_data: `to_${filteredTokens[i].ticker}_${filteredTokens[i].chain}` }
        ];
        if (filteredTokens[i + 1]) {
          row.push({ text: `${filteredTokens[i + 1].ticker} ${filteredTokens[i + 1].name}`, callback_data: `to_${filteredTokens[i + 1].ticker}_${filteredTokens[i + 1].chain}` });
        }
        tokenRows.push(row);
      }
      
      tokenRows.push([{ text: '⬅️ Back', callback_data: 'back_to_step_1' }]);
      
      const keyboard = { inline_keyboard: tokenRows };

      await bot.editMessageText(`✅ Source: ${ticker}\n\nStep 2 of 5: Select DESTINATION token`, {
        chat_id: chatId,
        message_id: query.message!.message_id,
        reply_markup: keyboard
      });
    } else if (data.startsWith('to_')) {
      const [, ticker, chain] = data.split('_');
      session.data.currencyTo = ticker;
      session.data.chainTo = chain;
      session.step = 3;

      const backKeyboard = {
        inline_keyboard: [[{ text: '⬅️ Back', callback_data: 'back_to_step_2' }]]
      };

      await bot.editMessageText(`✅ Destination: ${ticker}\n\nStep 3 of 5: Enter amount (${session.data.currencyFrom})\n\nExamples: 1.5 or 10 or 0.1`, {
        chat_id: chatId,
        message_id: query.message!.message_id,
        reply_markup: backKeyboard
      });
    } else if (data === 'confirm_swap') {
      if (!simpleSwapClient) {
        await bot.sendMessage(chatId, '⚠️ Swap service not available');
        return;
      }

      await bot.sendMessage(chatId, '⏳ Creating swap order...');

      try {
        const networkFrom = CHAIN_TO_NETWORK[session.data.chainFrom!] || session.data.chainFrom!;
        const networkTo = CHAIN_TO_NETWORK[session.data.chainTo!] || session.data.chainTo!;
        
        let tickerFrom = session.data.currencyFrom!.toLowerCase();
        let tickerTo = session.data.currencyTo!.toLowerCase();
        
        if (tickerFrom === 'bnb' && networkFrom === 'bsc') {
          tickerFrom = 'bnb-bsc';
        }
        if (tickerTo === 'bnb' && networkTo === 'bsc') {
          tickerTo = 'bnb-bsc';
        }
        
        const exchange = await simpleSwapClient.createExchange({
          fixed: false,
          tickerFrom: tickerFrom,
          tickerTo: tickerTo,
          amount: session.data.amount!,
          addressTo: session.data.addressTo!,
          networkFrom: networkFrom,
          networkTo: networkTo
        });

        const orderId = exchange.publicId || exchange.id || 'unknown';
        session.data.orderId = orderId;
        
        session.swapHistory.push({
          orderId,
          from: session.data.currencyFrom!,
          to: session.data.currencyTo!,
          amount: session.data.amount!,
          timestamp: Date.now(),
          status: exchange.status || 'waiting'
        });

        await storage.trackSwapCreation(orderId, session.data.chainFrom!, session.data.chainTo!);
        
        const volumeUSD = await priceOracle.calculateVolumeUSD(session.data.amount!, session.data.currencyFrom!);
        await storage.updateSwapVolume(volumeUSD);

        const successMessage = `✅ Swap Created

Order ID: ${orderId}
Status: Waiting for deposit

📥 Send exactly ${session.data.amount} ${session.data.currencyFrom} to:
\`${exchange.addressFrom}\`

⏱ Expires in: 2 hours

🔒 Your swap is private - no KYC required`;

        const keyboard = {
          inline_keyboard: [
            [{ text: '✅ Check Status', callback_data: `check_status_${orderId}` }]
          ]
        };

        await bot.sendMessage(chatId, successMessage, {
          parse_mode: 'Markdown',
          reply_markup: keyboard
        });
        
        session.currentFlow = 'idle';
        session.step = 0;
      } catch (error: any) {
        const sanitizedError = error.message
          ?.replace(/SimpleSwap/gi, 'exchange service')
          ?.replace(/Replit/gi, 'platform')
          ?.replace(/API error/gi, 'service error') || 'Unknown error occurred';
        
        await bot.sendMessage(chatId, `❌ Error creating swap: ${sanitizedError}`);
        session.currentFlow = 'idle';
      }
    } else if (data === 'cancel_swap') {
      session.currentFlow = 'idle';
      session.step = 0;
      await bot.sendMessage(chatId, '❌ Swap cancelled');
    } else if (data === 'back_to_step_1') {
      session.step = 1;
      session.data.currencyTo = undefined;
      session.data.chainTo = undefined;

      const tokenRows = [];
      for (let i = 0; i < POPULAR_TOKENS.length; i += 2) {
        const row = [
          { text: `${POPULAR_TOKENS[i].ticker} ${POPULAR_TOKENS[i].name}`, callback_data: `from_${POPULAR_TOKENS[i].ticker}_${POPULAR_TOKENS[i].chain}` }
        ];
        if (POPULAR_TOKENS[i + 1]) {
          row.push({ text: `${POPULAR_TOKENS[i + 1].ticker} ${POPULAR_TOKENS[i + 1].name}`, callback_data: `from_${POPULAR_TOKENS[i + 1].ticker}_${POPULAR_TOKENS[i + 1].chain}` });
        }
        tokenRows.push(row);
      }

      const keyboard = { inline_keyboard: tokenRows };

      await bot.editMessageText(`🔄 Create Your Swap\n\nStep 1 of 5: Select SOURCE token`, {
        chat_id: chatId,
        message_id: query.message!.message_id,
        reply_markup: keyboard
      });
    } else if (data === 'back_to_step_2') {
      session.step = 2;
      session.data.amount = undefined;

      const filteredTokens = POPULAR_TOKENS.filter(t => t.ticker !== session.data.currencyFrom);
      const tokenRows = [];
      for (let i = 0; i < filteredTokens.length; i += 2) {
        const row = [
          { text: `${filteredTokens[i].ticker} ${filteredTokens[i].name}`, callback_data: `to_${filteredTokens[i].ticker}_${filteredTokens[i].chain}` }
        ];
        if (filteredTokens[i + 1]) {
          row.push({ text: `${filteredTokens[i + 1].ticker} ${filteredTokens[i + 1].name}`, callback_data: `to_${filteredTokens[i + 1].ticker}_${filteredTokens[i + 1].chain}` });
        }
        tokenRows.push(row);
      }
      
      tokenRows.push([{ text: '⬅️ Back', callback_data: 'back_to_step_1' }]);
      
      const keyboard = { inline_keyboard: tokenRows };

      await bot.editMessageText(`✅ Source: ${session.data.currencyFrom}\n\nStep 2 of 5: Select DESTINATION token`, {
        chat_id: chatId,
        message_id: query.message!.message_id,
        reply_markup: keyboard
      });
    } else if (data === 'back_to_step_3') {
      session.step = 3;
      session.data.addressTo = undefined;

      const backKeyboard = {
        inline_keyboard: [[{ text: '⬅️ Back', callback_data: 'back_to_step_2' }]]
      };

      await bot.editMessageText(`✅ Destination: ${session.data.currencyTo}\n\nStep 3 of 5: Enter amount (${session.data.currencyFrom})\n\nExamples: 1.5 or 10 or 0.1`, {
        chat_id: chatId,
        message_id: query.message!.message_id,
        reply_markup: backKeyboard
      });
    } else if (data === 'back_to_step_4') {
      session.step = 4;

      const price = await priceOracle.getPrice(session.data.currencyFrom!);
      const amount = parseFloat(session.data.amount!);
      const usdValue = price ? (amount * price).toFixed(2) : 'N/A';

      const backKeyboard = {
        inline_keyboard: [[{ text: '⬅️ Back', callback_data: 'back_to_step_3' }]]
      };

      await bot.editMessageText(`💰 Swap Preview\n\nFrom: ${session.data.amount} ${session.data.currencyFrom} (~$${usdValue} USD)\nTo: ${session.data.currencyTo}\n\nStep 4 of 5: Enter ${session.data.currencyTo} address`, {
        chat_id: chatId,
        message_id: query.message!.message_id,
        reply_markup: backKeyboard
      });
    } else if (data.startsWith('check_status_')) {
      const orderId = data.replace('check_status_', '');
      
      if (!simpleSwapClient) {
        await bot.answerCallbackQuery(query.id, { text: '⚠️ Swap service not available' });
        return;
      }

      try {
        const exchange = await simpleSwapClient.getExchange(orderId);
        
        const statusEmoji = {
          'waiting': '⏳',
          'confirming': '🔄',
          'exchanging': '🔄',
          'sending': '📤',
          'finished': '✅',
          'failed': '❌',
          'refunded': '↩️',
          'expired': '⏱️'
        }[exchange.status] || '❓';

        let statusMessage = `📊 Swap Status

Order: ${orderId}
Status: ${statusEmoji} ${exchange.status}

From: ${exchange.amountFrom} ${exchange.tickerFrom || exchange.currencyFrom}
To: ${exchange.amountTo || exchange.expectedAmount || 'Calculating...'} ${exchange.tickerTo || exchange.currencyTo}
Address: ${exchange.addressTo}`;

        if (exchange.status === 'finished' && exchange.hashOut) {
          const explorerUrls: Record<string, string> = {
            'eth': `https://etherscan.io/tx/${exchange.hashOut}`,
            'bsc': `https://bscscan.com/tx/${exchange.hashOut}`,
            'matic': `https://polygonscan.com/tx/${exchange.hashOut}`,
            'sol': `https://solscan.io/tx/${exchange.hashOut}`,
            'btc': `https://blockchain.com/btc/tx/${exchange.hashOut}`,
            'avaxc': `https://snowtrace.io/tx/${exchange.hashOut}`,
            'arbitrum': `https://arbiscan.io/tx/${exchange.hashOut}`,
            'optimism': `https://optimistic.etherscan.io/tx/${exchange.hashOut}`,
            'base': `https://basescan.org/tx/${exchange.hashOut}`,
            'trx': `https://tronscan.org/#/transaction/${exchange.hashOut}`,
            'zec': `https://zcashblockexplorer.com/transactions/${exchange.hashOut}`
          };

          const network = exchange.networkTo || exchange.tickerTo?.toLowerCase() || '';
          const explorerUrl = explorerUrls[network];

          if (explorerUrl) {
            statusMessage += `\n\n🔗 [View Transaction](${explorerUrl})`;
          }
        }

        try {
          await bot.editMessageText(statusMessage, {
            chat_id: chatId,
            message_id: query.message!.message_id,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '🔄 Refresh', callback_data: `check_status_${orderId}` }]
              ]
            }
          });
          await bot.answerCallbackQuery(query.id);
        } catch (editError: any) {
          if (editError.message?.includes('message is not modified')) {
            await bot.answerCallbackQuery(query.id, { text: 'ℹ️ No updates yet', show_alert: false });
          } else {
            throw editError;
          }
        }
      } catch (error: any) {
        const sanitizedError = error.message
          ?.replace(/SimpleSwap/gi, 'exchange service')
          ?.replace(/Replit/gi, 'platform')
          ?.replace(/API error/gi, 'service error') || 'Order not found';
        await bot.answerCallbackQuery(query.id, { text: `❌ Error: ${sanitizedError}`, show_alert: true });
      }
    }
  });

  bot.on('text', async (msg) => {
    if (msg.text?.startsWith('/')) return;

    const chatId = msg.chat.id;
    const session = getSession(msg.from!.id);

    if (session.currentFlow === 'swap') {
      if (session.step === 3) {
        const amount = parseFloat(msg.text || '0');
        if (isNaN(amount) || amount <= 0) {
          await bot.sendMessage(chatId, '⚠️ Invalid amount. Please enter a valid number');
          return;
        }

        session.data.amount = msg.text!;
        session.step = 4;

        const price = await priceOracle.getPrice(session.data.currencyFrom!);
        const usdValue = price ? (amount * price).toFixed(2) : 'N/A';

        const backKeyboard = {
          inline_keyboard: [[{ text: '⬅️ Back', callback_data: 'back_to_step_3' }]]
        };

        await bot.sendMessage(chatId, `💰 Swap Preview\n\nFrom: ${msg.text} ${session.data.currencyFrom} (~$${usdValue} USD)\nTo: ${session.data.currencyTo}\n\nStep 4 of 5: Enter ${session.data.currencyTo} address`, {
          reply_markup: backKeyboard
        });
      } else if (session.step === 4) {
        const address = msg.text!.trim();
        
        if (!validateAddress(address, session.data.chainTo!)) {
          await bot.sendMessage(chatId, `⚠️ Invalid ${session.data.currencyTo} address format. Please try again.`);
          return;
        }

        session.data.addressTo = address;
        session.step = 5;

        const price = await priceOracle.getPrice(session.data.currencyFrom!);
        const usdValue = price ? (parseFloat(session.data.amount!) * price).toFixed(2) : 'N/A';

        const keyboard = {
          inline_keyboard: [
            [
              { text: '✅ Confirm Swap', callback_data: 'confirm_swap' },
              { text: '❌ Cancel', callback_data: 'cancel_swap' }
            ],
            [
              { text: '⬅️ Back', callback_data: 'back_to_step_4' }
            ]
          ]
        };

        await bot.sendMessage(chatId, `📍 Address verified ✓\n\nStep 5 of 5: Confirm swap?\n\nFrom: ${session.data.amount} ${session.data.currencyFrom} (~$${usdValue})\nTo: ${session.data.addressTo}\nEstimated: ${session.data.currencyTo}`, {
          reply_markup: keyboard
        });
      }
    }
  });

  return bot;
}
