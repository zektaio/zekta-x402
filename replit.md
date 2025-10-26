# Zekta x402 Marketplace

## Overview

Zekta x402 Marketplace is a privacy-first marketplace enabling anonymous access to premium AI, data, and Web3 services. The platform uses zero-knowledge proofs (Semaphore Protocol v4) for authentication and implements the x402 protocol for decentralized service payments on the Base network. Users can purchase services anonymously using multiple cryptocurrencies without KYC requirements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Components**: Shadcn UI component library built on Radix UI primitives, providing a complete set of accessible components (dialogs, cards, buttons, forms, etc.) with Tailwind CSS for styling.

**State Management**: TanStack React Query (v5) for server state management with custom query client configuration. Local state uses React hooks.

**Routing**: Wouter for lightweight client-side routing with 5 main routes:
- `/` - Landing page
- `/docs` - Documentation
- `/x402marketplace` - Main marketplace interface
- `/x402playground` - Service testing interface
- `*` - 404 not found page

**Key Features**:
- Zero-knowledge identity management using Semaphore Protocol
- File-based identity backup/restore system (no manual secret paste required)
- Purchase history tracking with blockchain verification links
- Transaction history for credit topups and spending
- Interactive service testing playground

### Backend Architecture

**Runtime**: Node.js with Express.js server framework

**API Design**: RESTful endpoints under `/api` prefix with JSON request/response format

**Key Services**:
- `x402-client.ts` - Implements x402 protocol for payment-required HTTP responses (402 status code) and ERC-3009 payment authorization
- `wallet.ts` - Handles cryptocurrency payment processing (SOL, ETH, BTC, USDC, USDT)
- `eth-wallet.ts` - Base network integration using ethers.js for EVM transactions
- `storage.ts` - Data access layer abstracting database operations
- `db.ts` - Database connection management using Drizzle ORM with Neon Postgres

**Authentication**: Zero-knowledge proofs for anonymous user verification without storing personal identifiable information

### Database Architecture

**ORM**: Drizzle ORM with Neon Postgres serverless database

**Schema Design** (4 core tables):

1. **users** - Anonymous user identities
   - `zkCommitment` (unique) - Semaphore protocol commitment hash
   - `creditBalanceUSD` - Current credit balance
   - No personal information stored

2. **x402_services** - Marketplace service catalog
   - Service metadata (name, description, category)
   - `priceUSD` - Service pricing
   - `x402Endpoint` - Service API endpoint
   - `isActive` - Availability flag

3. **x402_purchases** - Purchase records
   - Links user to purchased services
   - `priceUSDPaid` - Historical price tracking
   - `txHash` - Blockchain transaction reference

4. **credit_transactions** - Financial history
   - `type` - 'topup' or 'spend'
   - `amountUSD` - Transaction amount
   - `txHash` - Blockchain verification

**Rationale**: Minimal schema focused on x402 marketplace functionality only. No domain registration, gift card, or social media features to keep the codebase clean and focused.

### Security Architecture

**Zero-Knowledge Authentication**:
- Semaphore Protocol v4 for generating cryptographic proofs
- Identity stored client-side only (browser localStorage)
- Commitment hash used as user identifier
- No passwords or traditional authentication

**Privacy Design**:
- No KYC requirements
- No personal data collection
- Blockchain transactions for transparency without identity exposure
- File-based identity backup for user control

**Payment Security**:
- Multi-signature wallet support
- Private keys stored in environment variables
- Transaction verification via blockchain explorers

## External Dependencies

### Third-Party Libraries

**Cryptography**:
- `@semaphore-protocol/core` - Zero-knowledge group management
- `@semaphore-protocol/identity` - Identity generation and management
- `@semaphore-protocol/proof` - Proof generation and verification
- `ethers` - Ethereum/EVM blockchain interactions

**Blockchain**:
- `@solana/web3.js` - Solana network integration
- `@neondatabase/serverless` - Serverless Postgres database
- `bs58` - Base58 encoding for blockchain addresses

**UI/UX**:
- `@radix-ui/*` - Headless UI component primitives (21 components)
- `@tanstack/react-query` - Server state management
- `framer-motion` - Animation library
- `tailwind-merge` & `class-variance-authority` - CSS utilities

**Developer Tools**:
- `drizzle-orm` - Type-safe database ORM
- `zod` - Schema validation
- `tsx` - TypeScript execution for development

### External Services

**Database**: Neon Postgres serverless platform (requires `DATABASE_URL` environment variable)

**Blockchain Networks**:
- Base Network (Layer 2) - Primary network for x402 protocol
- Ethereum Mainnet - ETH payments via LlamaRPC public endpoint
- Solana - SOL payment support
- Bitcoin, Zcash - Additional payment options

**RPC Providers**:
- `https://eth.llamarpc.com` - Ethereum mainnet RPC
- `https://api.mainnet-beta.solana.com` - Solana RPC (with optional Helius premium)
- Configured via `HELIUS_RPC_URL` environment variable

**Environment Variables Required**:
- `DATABASE_URL` - Neon Postgres connection string
- `EVM_HOT_WALLET_KEY` - Private key for Base/ETH transactions
- `HELIUS_RPC_URL` (optional) - Premium Solana RPC endpoint
- `SOLANA_PRIVATE_KEY_B58` (optional) - Solana wallet private key

### Development Tools

**Build System**: Vite with custom configuration for Replit integration
- Runtime error overlay
- Cartographer plugin for code navigation
- Dev banner for development environment

**Replit-Specific**: 
- `@replit/vite-plugin-runtime-error-modal`
- `@replit/vite-plugin-cartographer`
- `@replit/vite-plugin-dev-banner`

**Why These Choices**:
- Neon Postgres chosen for serverless scalability and zero-downtime deployments
- Drizzle ORM for type safety and minimal runtime overhead vs. Prisma
- Semaphore Protocol for production-ready zero-knowledge proofs
- Ethers.js for comprehensive EVM support and active maintenance
- Vite for fast development experience and optimized production builds