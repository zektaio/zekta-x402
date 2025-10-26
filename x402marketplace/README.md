# Zekta x402 Marketplace

Privacy-first marketplace for anonymous access to premium AI, data, and Web3 services using zero-knowledge proofs and the x402 protocol.

## Features

- **Anonymous Authentication**: Semaphore Protocol v4 zero-knowledge identity system
- **File-Based Identity**: Automatic backup file download for identity recovery
- **Multi-Crypto Payments**: Support for BTC, ETH, SOL, USDT, USDC, and more
- **x402 Protocol**: Decentralized service payments on Base network
- **Purchase History**: Track all service purchases with blockchain verification
- **Transaction History**: Monitor credit topups and spending
- **Service Playground**: Test purchased services with interactive API interface

## Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite build system
- Wouter for routing
- Shadcn UI component library
- TanStack React Query for state management

**Backend:**
- Node.js with Express
- Drizzle ORM with PostgreSQL
- x402 protocol client
- Multi-chain wallet integration (Solana, Base, Ethereum)

**Blockchain:**
- Semaphore Protocol for zero-knowledge proofs
- Base network for x402 payments
- Ethers.js for EVM interactions
- Solana web3.js for SOL transactions

## Database Schema

- **users**: Anonymous user identities (zkCommitment, creditBalance)
- **x402_services**: Available marketplace services
- **x402_purchases**: User service purchase records
- **credit_transactions**: Topup and spending history

## API Endpoints

### Authentication
- `POST /api/x402/auth/register` - Register new zero-knowledge identity
- `POST /api/x402/auth/login` - Login with zero-knowledge proof

### Services
- `GET /api/x402/services` - List all available services
- `POST /api/x402/purchase/:serviceId` - Purchase a service

### Credits
- `POST /api/x402/credits/topup` - Add credits to account
- `GET /api/x402/credits/transactions` - Get transaction history

### Purchases
- `GET /api/x402/purchases` - Get user purchase history

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
DATABASE_URL=your_postgres_url
EVM_HOT_WALLET_KEY=your_private_key
```

3. Push database schema:
```bash
npm run db:push
```

4. Start development server:
```bash
npm run dev
```

## Usage

### Generate Identity
Create a new zero-knowledge identity that automatically downloads a backup file.

### Top-Up Credits
Pay with any supported cryptocurrency. Funds are converted to USDC on Base network.

### Purchase Services
Browse the marketplace, select services, and purchase anonymously using your zero-knowledge identity.

### Test Services
Use the playground interface to test purchased services with real API calls.

## Security

- Zero-knowledge authentication (no personal data stored)
- Client-side identity generation
- Blockchain transaction verification
- No KYC requirements
- Multi-signature wallet support

## Routes

- `/` - Landing page
- `/docs` - Documentation
- `/x402marketplace` - Main marketplace interface
- `/x402playground` - Service testing playground

## Author

**Zekta** <dev@zekta.io>

## License

MIT License
