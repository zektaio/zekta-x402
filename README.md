# Zekta x402 Marketplace

Privacy-first marketplace for anonymous access to premium AI, data, and Web3 services using zero-knowledge proofs and x402 protocol.

## 🚀 Features

- **Anonymous Authentication**: Semaphore ZK identity (zkID) for privacy
- **File Upload Auth**: zkID backup file system (no manual paste)
- **Multi-Crypto Payments**: Support for BTC, ETH, SOL, USDT, USDC, etc.
- **x402 Protocol**: Decentralized service marketplace on Base network
- **Purchase History**: Track all service purchases with blockchain verification
- **Transaction History**: Monitor credit topups and spending
- **Interactive Playground**: Test purchased services with real API calls

## 📁 Project Structure

```
x402marketplace/
├── client/src/
│   ├── pages/
│   │   ├── X402Marketplace.tsx   # Main marketplace UI (901 lines)
│   │   ├── X402Playground.tsx    # Service testing interface (330 lines)
│   │   ├── Landing.tsx           # Homepage
│   │   ├── Docs.tsx              # Documentation
│   │   └── not-found.tsx         # 404 page
│   ├── components/               # Shadcn UI components
│   ├── lib/                      # React Query client & utilities
│   └── App.tsx                   # Clean app with only x402 routes
├── server/
│   ├── x402-client.ts           # x402 protocol integration
│   ├── db.ts                    # Database connection
│   ├── storage.ts               # Data access layer
│   ├── wallet.ts                # Crypto payment handling
│   └── eth-wallet.ts            # Base network integration
├── shared/
│   └── schema.ts                # Database schema (x402 tables only)
└── README.md                    # This file
```

## 🗄️ Database Schema

- **users**: Anonymous user identities (zkCommitment, creditBalance)
- **x402_services**: Available marketplace services
- **x402_purchases**: User service purchase records
- **credit_transactions**: Topup & spending history

## 🔐 Security

- **Zero-Knowledge Authentication**: Semaphore Protocol v4
- **No KYC Required**: Fully anonymous transactions
- **zkID File Upload**: Secure identity management
- **On-Chain Verification**: Base network transaction proof

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Wouter, Shadcn UI
- **Backend**: Node.js, Express, Drizzle ORM, PostgreSQL
- **Blockchain**: Solana (swaps), Base (x402 protocol)
- **ZK Proofs**: Semaphore Protocol
- **Payment**: Multi-cryptocurrency support via zkSwap

## 📝 API Endpoints

### Authentication
- `POST /api/x402/auth/register` - Register new zkID
- `POST /api/x402/auth/login` - Login with zkID

### Services
- `GET /api/x402/services` - List all available services
- `POST /api/x402/purchase/:serviceId` - Purchase a service

### Credits
- `POST /api/x402/credits/topup` - Add credits to account
- `GET /api/x402/credits/transactions` - Get transaction history

### Purchases
- `GET /api/x402/purchases` - Get user purchase history

## 🎯 Usage

### 1. Generate zkID
```typescript
const identity = new Identity();
const commitment = identity.commitment.toString();
// Auto-downloads backup file: zkid-backup-{hash}.json
```

### 2. Top-Up Credits
```typescript
// Pay with any supported cryptocurrency
// Converts to USDC on Base network automatically
```

### 3. Purchase Services
```typescript
// Browse marketplace → Select service → Purchase
// Access granted instantly with zkID proof
```

### 4. Test Services
```typescript
// Use X402Playground to test purchased services
// Make API calls anonymously with credit deduction
```

## 🌐 Routes

- `/` - Landing page
- `/docs` - Documentation
- `/x402marketplace` - Main marketplace
- `/x402playground` - Service testing playground

## 👨‍💻 Author

**Zekta** <dev@zekta.io>

## 📄 License

MIT License - See GitHub repository for details

## 🔗 Links

- GitHub: https://github.com/zektaio/zekta-x402
- Documentation: Coming soon
- x402 Protocol: https://x402.org
