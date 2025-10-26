# Zekta x402 Marketplace - Technical Documentation

**Version:** 1.0  
**Date:** October 26, 2025  
**Platform:** Zekta Protocol - Zero-Knowledge Action Layer

---

## Executive Summary

The Zekta x402 Marketplace is an **anonymous API gateway** that enables users to access premium AI, data, and Web3 services using any cryptocurrency without KYC requirements. The platform leverages zero-knowledge proofs (Semaphore Protocol) for privacy-preserving authentication and integrates with the x402 protocol for decentralized API payments.

**Key Features:**
- ✅ Anonymous authentication via ZK proofs
- ✅ Pay with 8+ cryptocurrencies (SOL, BTC, ETH, BNB, MATIC, AVAX, ZEC, ZEKTA)
- ✅ Automatic conversion to USDC Base for x402 payments
- ✅ Access to 14+ premium services (OpenAI, Claude, Gemini, Firecrawl, etc.)
- ✅ Playground interface for instant service usage
- ✅ Complete transaction history and logging

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [Payment Flow](#payment-flow)
5. [API Endpoints](#api-endpoints)
6. [User Journey](#user-journey)
7. [Security Architecture](#security-architecture)
8. [Service Catalog](#service-catalog)
9. [Environment Setup](#environment-setup)
10. [Development Workflow](#development-workflow)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│            React + TypeScript + Vite                    │
│         (User Interface & State Management)              │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/WebSocket
┌────────────────────▼────────────────────────────────────┐
│                   Backend Layer                          │
│           Node.js + Express + TypeScript                │
│         (Business Logic & API Gateway)                   │
└─────┬──────────┬──────────┬──────────┬─────────────────┘
      │          │          │          │
      ▼          ▼          ▼          ▼
┌─────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐
│Database │ │zkSwap  │ │Semaphore │ │x402 Services │
│PostgreSQL│ │Payment │ │ZK Proofs │ │(OpenAI, etc) │
└─────────┘ └────────┘ └──────────┘ └──────────────┘
```

### Component Breakdown

#### Frontend Layer
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite (HMR, optimized builds)
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** TanStack Query v5 (server state)
- **UI Components:** Radix UI + shadcn/ui (accessible primitives)
- **Styling:** Tailwind CSS + Framer Motion

#### Backend Layer
- **Runtime:** Node.js 20.x
- **Framework:** Express.js 4.x
- **Language:** TypeScript 5.x
- **ORM:** Drizzle ORM with Zod validation
- **Database:** PostgreSQL (Neon serverless)

#### Integration Layer
- **Blockchain:** Solana web3.js, viem (EVM)
- **ZK Proofs:** Semaphore Protocol v4.13.1
- **x402:** Official Coinbase SDK
- **Payment:** zkSwap (multi-crypto conversion)

---

## Technology Stack

### 1. Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI component framework |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Vite** | Latest | Build tool & dev server (HMR) |
| **Wouter** | Latest | Lightweight routing (2KB) |
| **TanStack Query** | v5 | Server state & caching |
| **Radix UI** | Latest | Accessible UI primitives |
| **shadcn/ui** | Latest | Pre-built component library |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **Framer Motion** | Latest | Animation library |
| **Lucide React** | Latest | Icon system (tree-shakeable) |
| **Zod** | Latest | Runtime type validation |
| **React Hook Form** | Latest | Form state management |

**Frontend Architecture Patterns:**
- Component composition over inheritance
- Container/Presentational component split
- Custom hooks for shared logic
- TanStack Query for all server state
- Optimistic updates for better UX

**Key Features:**
- Dark/light mode with system preference detection
- Responsive design (mobile-first approach)
- Real-time updates via TanStack Query
- Accessible components (WCAG 2.1 AA compliant)
- Progressive loading states

---

### 2. Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime |
| **Express.js** | 4.x | Web application framework |
| **TypeScript** | 5.x | Type safety & developer experience |
| **Drizzle ORM** | Latest | Type-safe SQL ORM |
| **PostgreSQL** | 16.x | Relational database |
| **Neon** | Latest | Serverless Postgres provider |
| **drizzle-zod** | Latest | Zod schema generation from Drizzle |
| **tsx** | Latest | TypeScript execution |

**Backend Architecture Patterns:**
- **MVC-like Structure:**
  - Routes: API endpoint definitions
  - Services: Business logic layer
  - Storage: Data access layer (IStorage interface)
- **Middleware Pipeline:**
  - Request validation (Zod schemas)
  - Error handling
  - Logging
- **Dependency Injection:**
  - Service instances passed to routes
  - Easier testing and mocking

**File Structure:**
```
server/
├── index.ts              # Entry point, server initialization
├── routes.ts             # API route definitions
├── storage.ts            # Database interface (IStorage)
├── services/
│   ├── x402-client.ts    # x402 protocol client
│   ├── zkswap.ts         # Payment conversion service
│   └── semaphore.ts      # ZK proof verification
└── middleware/
    ├── auth.ts           # ZK authentication
    └── validation.ts     # Request validation
```

---

### 3. Blockchain & Web3

| Technology | Version | Purpose |
|------------|---------|---------|
| **@solana/web3.js** | Latest | Solana blockchain interactions |
| **@semaphore-protocol/core** | v4.13.1 | ZK identity groups |
| **@semaphore-protocol/identity** | v4.13.1 | Identity generation |
| **@semaphore-protocol/proof** | v4.13.1 | Proof generation/verification |
| **viem** | Latest | EVM blockchain toolkit |
| **ethers.js** | v6 | Ethereum utilities |
| **bs58** | Latest | Base58 encoding (Solana) |

**Blockchain Networks:**
- **Solana Mainnet:** Payment detection, ZEKTA token swaps
- **Base Mainnet:** USDC settlement for x402 payments
- **Ethereum:** Backup for EVM operations

**Key Operations:**
- **Solana:**
  - Monitor operator wallet for deposits
  - Execute token swaps via Jupiter/Raydium
  - Transaction relaying (gasless for users)
- **Base:**
  - USDC transferWithAuthorization (ERC-3009)
  - x402 payment settlement
  - Gas fee sponsorship
- **Semaphore:**
  - Generate anonymous identities
  - Verify ZK membership proofs
  - Maintain commitment groups

---

### 4. x402 Protocol Integration

| Component | Provider | Purpose |
|-----------|----------|---------|
| **x402 SDK** | @coinbase/x402 | Official protocol implementation |
| **CDP Facilitator** | Coinbase | Payment verification & settlement |
| **ERC-3009** | USDC Contract | `transferWithAuthorization` signing |
| **Payment Network** | Base Mainnet | On-chain settlement layer |

**x402 Protocol Flow:**

```
1. Client Request
   ↓
2. Service Returns: HTTP 402 Payment Required
   {
     "x402Version": 1,
     "accepts": [{
       "scheme": "exact",
       "network": "base",
       "maxAmountRequired": "30000",  // 0.03 USDC
       "recipient": "0xABC...",
       "facilitator": "https://x402.org/facilitator"
     }]
   }
   ↓
3. Backend Creates ERC-3009 Signature
   transferWithAuthorization(
     from: operatorWallet,
     to: serviceRecipient,
     value: 30000,  // 0.03 USDC
     validAfter: now,
     validBefore: now + 5min,
     nonce: unique,
     signature: signed
   )
   ↓
4. Submit to Facilitator
   POST /facilitator/verify
   Body: { paymentPayload, paymentRequirements }
   ↓
5. Facilitator Verifies & Returns Proof
   ↓
6. Retry Request with X-PAYMENT Header
   GET /service-endpoint
   Headers: { "X-PAYMENT": "<base64 encoded proof>" }
   ↓
7. Facilitator Settles On-Chain
   Execute USDC transfer on Base network
   ↓
8. Service Returns Data
   Response: { result: "..." }
```

**Key Components:**

**ERC-3009 (USDC Transfer Authorization):**
- Allows gasless USDC transfers
- User signs authorization, facilitator executes
- Time-bound with nonce for security
- No direct wallet interaction required

**CDP Facilitator Endpoints:**
- `/verify` - Validate payment authorization
- `/settle` - Execute on-chain settlement
- Fee-free for Base mainnet USDC
- KYT/OFAC checks on every transaction

---

### 5. Payment & Conversion Systems

| Service | Purpose | Supported Assets |
|---------|---------|------------------|
| **zkSwap** | Multi-crypto aggregator | SOL, BTC, ETH, BNB, MATIC, AVAX, ZEC, ZEKTA |
| **Jupiter** | Solana DEX aggregator | All SPL tokens |
| **Raydium** | Solana AMM | SOL-based trading pairs |
| **Wormhole** | Cross-chain bridge | USDC Solana ↔ Base |
| **Across Protocol** | Fast bridge | Optimistic USDC transfers |

**Conversion Pipeline:**

```
User Deposit (Any Crypto)
    ↓
Step 1: Detect on respective blockchain
    ↓
Step 2: Swap to USDC on source chain
    (Jupiter for Solana, Uniswap for EVM)
    ↓
Step 3: Bridge USDC to Base network
    (Wormhole or Across Protocol)
    ↓
Step 4: USDC Base in operator wallet
    ↓
Step 5: Credit user account (database)
```

**Conversion Examples:**

**ZEKTA Token Flow:**
```
ZEKTA (Solana) → SOL → USDC SPL → Bridge → USDC Base
Time: ~5 minutes
Steps: 3 swaps + 1 bridge
```

**SOL Flow:**
```
SOL → USDC SPL → Bridge → USDC Base
Time: ~2 minutes
Steps: 1 swap + 1 bridge
```

**ETH Flow:**
```
ETH → USDC ERC20 → Bridge → USDC Base
Time: ~3 minutes
Steps: 1 swap + 1 bridge
```

---

### 6. External APIs & Services

| Service | Integration Type | Purpose |
|---------|-----------------|---------|
| **Daydreams Router** | x402 | OpenAI, Claude, Gemini API proxy |
| **Firecrawl** | x402 | Web scraping & data extraction |
| **Pinata** | x402 | IPFS file storage |
| **Neynar** | x402 | Farcaster social data API |
| **Heurist** | x402 | AI research reports |
| **CoinGecko** | REST API | Cryptocurrency price oracle |
| **Helius** | RPC | Solana blockchain indexing |

**Service Integration Pattern:**
```typescript
// All x402 services follow this pattern
const response = await x402Client.callService({
  endpoint: 'https://service.x402.com',
  method: 'POST',
  body: userInput,
  payment: {
    wallet: operatorWallet,
    network: 'base',
    token: 'USDC'
  }
});
```

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────┐
│    users     │
│──────────────│
│ zk_commitment│ (PK, VARCHAR)
│ credit_balance│
│ created_at   │
└──────┬───────┘
       │
       │ 1:N
       │
       ├─────────────────────────────┐
       │                             │
       ▼                             ▼
┌─────────────────┐          ┌──────────────────┐
│credit_transactions│        │  x402_purchases  │
│─────────────────│          │──────────────────│
│ id              │          │ id               │
│ user_zk_commit* │ (FK)     │ user_zk_commit*  │ (FK)
│ amount_usd      │          │ service_id       │ (FK)
│ crypto_paid     │          │ request_data     │
│ status          │          │ response_data    │
│ tx_hash         │          │ status           │
└─────────────────┘          │ price_usd        │
                              │ x402_tx_hash     │
                              └────────┬─────────┘
                                       │
                                       │ 1:N
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  purchase_logs   │
                              │──────────────────│
                              │ id               │
                              │ purchase_id      │ (FK)
                              │ timestamp        │
                              │ status           │
                              │ message          │
                              │ metadata         │
                              └──────────────────┘

┌──────────────────┐
│  x402_services   │
│──────────────────│
│ id               │ (PK, VARCHAR)
│ name             │
│ description      │
│ category         │
│ endpoint_url     │
│ price_per_call   │
│ provider         │
│ facilitator      │
│ network          │
└──────────────────┘
```

### Table Definitions

#### **1. users**

```sql
CREATE TABLE users (
  zk_commitment VARCHAR(255) PRIMARY KEY,
  credit_balance DECIMAL(20, 6) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_created ON users(created_at);
```

**Purpose:** Store anonymous user accounts  
**Primary Key:** Semaphore ZK commitment (hash of public key)  
**Fields:**
- `zk_commitment`: Unique anonymous identifier (unlinkable to real identity)
- `credit_balance`: USDC balance available for service purchases
- `created_at`: Account creation timestamp

**Example Record:**
```json
{
  "zk_commitment": "0x5b3a7f2164e8c9d4a2f8b7e3c6d1a5f9e2b4c7d8",
  "credit_balance": 9.97,
  "created_at": "2025-10-26T14:30:00Z"
}
```

---

#### **2. credit_transactions**

```sql
CREATE TABLE credit_transactions (
  id SERIAL PRIMARY KEY,
  user_zk_commitment VARCHAR(255) REFERENCES users(zk_commitment),
  amount_usd DECIMAL(20, 6) NOT NULL,
  crypto_paid VARCHAR(10),
  crypto_amount DECIMAL(30, 18),
  status VARCHAR(50) NOT NULL,
  tx_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_credit_tx_user ON credit_transactions(user_zk_commitment);
CREATE INDEX idx_credit_tx_status ON credit_transactions(status);
CREATE INDEX idx_credit_tx_created ON credit_transactions(created_at);
```

**Purpose:** Track credit top-up transactions  
**Status Values:**
- `pending_payment` - Awaiting user's crypto deposit
- `converting` - zkSwap processing conversion
- `credited` - Balance updated successfully
- `failed` - Conversion or deposit failed

**Fields:**
- `amount_usd`: Final USD value credited
- `crypto_paid`: Which crypto user sent (SOL/BTC/ETH/etc)
- `crypto_amount`: Amount in original crypto
- `tx_hash`: Blockchain transaction hash

**Example Record:**
```json
{
  "id": 1,
  "user_zk_commitment": "0x5b3a7f2164...",
  "amount_usd": 10.00,
  "crypto_paid": "SOL",
  "crypto_amount": 0.05,
  "status": "credited",
  "tx_hash": "5Kn3Z7X...",
  "created_at": "2025-10-26T14:30:00Z",
  "completed_at": "2025-10-26T14:32:00Z"
}
```

---

#### **3. x402_services**

```sql
CREATE TABLE x402_services (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  endpoint_url VARCHAR(500),
  price_per_call DECIMAL(10, 6),
  provider VARCHAR(255),
  facilitator VARCHAR(255),
  network VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_category ON x402_services(category);
CREATE INDEX idx_services_active ON x402_services(is_active);
```

**Purpose:** Catalog of available x402 services  
**Categories:** `AI`, `Data`, `Web3`  
**Fields:**
- `endpoint_url`: x402-compatible service endpoint
- `facilitator`: CDP, PayAI, etc.
- `network`: base, base-sepolia
- `is_active`: Enable/disable services

**Example Record:**
```json
{
  "id": "openai-gpt4",
  "name": "OpenAI GPT-4o",
  "description": "Advanced AI text generation",
  "category": "AI",
  "endpoint_url": "https://daydreams.x402.com/openai",
  "price_per_call": 0.03,
  "provider": "Daydreams Router",
  "facilitator": "https://x402.org/facilitator",
  "network": "base",
  "is_active": true
}
```

---

#### **4. x402_purchases**

```sql
CREATE TABLE x402_purchases (
  id SERIAL PRIMARY KEY,
  user_zk_commitment VARCHAR(255) REFERENCES users(zk_commitment),
  service_id VARCHAR(100) REFERENCES x402_services(id),
  request_data JSONB NOT NULL,
  response_data JSONB,
  status VARCHAR(50) NOT NULL,
  price_usd DECIMAL(10, 6) NOT NULL,
  x402_tx_hash VARCHAR(255),
  facilitator_used VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_purchases_user ON x402_purchases(user_zk_commitment);
CREATE INDEX idx_purchases_service ON x402_purchases(service_id);
CREATE INDEX idx_purchases_status ON x402_purchases(status);
CREATE INDEX idx_purchases_created ON x402_purchases(created_at DESC);
```

**Purpose:** Record of all service purchases  
**Status Lifecycle:**
```
created → payment_processing → preparing → calling_service →
payment_required → signing_payment → verifying_payment →
executing → settling → completed
                        ↓
                     failed (at any stage)
```

**Fields:**
- `request_data`: User's input (JSONB for flexibility)
  - Example: `{"prompt": "Write a poem...", "model": "gpt-4o"}`
- `response_data`: Service output (JSONB)
  - Example: `{"content": "...", "usage": {"tokens": 200}}`
- `x402_tx_hash`: Base network transaction hash
- `facilitator_used`: Which facilitator processed payment

**Example Record:**
```json
{
  "id": 42,
  "user_zk_commitment": "0x5b3a7f2164...",
  "service_id": "openai-gpt4",
  "request_data": {
    "prompt": "Write a haiku about blockchain",
    "model": "gpt-4o",
    "maxTokens": 500
  },
  "response_data": {
    "content": "Silent chains conceal...",
    "usage": {
      "tokens": 45,
      "cost": 0.03
    }
  },
  "status": "completed",
  "price_usd": 0.03,
  "x402_tx_hash": "0x7fa9c2b8...",
  "facilitator_used": "CDP",
  "created_at": "2025-10-26T14:45:00Z",
  "completed_at": "2025-10-26T14:45:12Z"
}
```

---

#### **5. purchase_logs**

```sql
CREATE TABLE purchase_logs (
  id SERIAL PRIMARY KEY,
  purchase_id INTEGER REFERENCES x402_purchases(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50),
  message TEXT NOT NULL,
  metadata JSONB
);

CREATE INDEX idx_logs_purchase ON purchase_logs(purchase_id, timestamp);
```

**Purpose:** Detailed step-by-step logging for debugging and transparency  
**Fields:**
- `status`: Current status at this step
- `message`: Human-readable log message
- `metadata`: Additional context (JSONB)

**Example Records:**
```json
[
  {
    "id": 1,
    "purchase_id": 42,
    "timestamp": "2025-10-26T14:45:00Z",
    "status": "created",
    "message": "Order created for OpenAI GPT-4o",
    "metadata": {"user_agent": "Mozilla/5.0..."}
  },
  {
    "id": 2,
    "purchase_id": 42,
    "timestamp": "2025-10-26T14:45:01Z",
    "status": "payment_processing",
    "message": "Deducting $0.03 from balance",
    "metadata": {"balance_before": 10.00, "balance_after": 9.97}
  },
  {
    "id": 3,
    "purchase_id": 42,
    "timestamp": "2025-10-26T14:45:12Z",
    "status": "completed",
    "message": "Response received from service",
    "metadata": {"response_size": 1234, "tokens_used": 45}
  }
]
```

---

### Database Relationships

```
users (1) ──┬── (N) credit_transactions
            │
            └── (N) x402_purchases (1) ── (N) purchase_logs
            
x402_services (1) ── (N) x402_purchases
```

**Foreign Keys:**
- `credit_transactions.user_zk_commitment` → `users.zk_commitment`
- `x402_purchases.user_zk_commitment` → `users.zk_commitment`
- `x402_purchases.service_id` → `x402_services.id`
- `purchase_logs.purchase_id` → `x402_purchases.id` (CASCADE DELETE)

---

## Payment Flow

### Two-Stage Payment Architecture

The Zekta x402 Marketplace uses a **two-stage payment model** to abstract cryptocurrency complexity from end users while maintaining privacy.

---

### Stage 1: User → Zekta (Credit Top-Up)

**Objective:** Convert user's crypto to USDC Base in operator wallet

```
┌────────────────────────────────────────────────────────┐
│  STAGE 1: User Deposits → Operator Wallet Credits     │
└────────────────────────────────────────────────────────┘

User Wallet (SOL/BTC/ETH/etc)
    │
    │ (1) User sends crypto
    ▼
Operator Wallet (Multiple addresses)
├─ Solana: HGqcFDAhXc6zdVgoag88oVQdtbYL5GW...
├─ Ethereum: 0xdd16Fcf9d3B678DF28189C3b70a679...
├─ Bitcoin: bc1q... (future)
└─ BNB Chain: 0x... (future)
    │
    │ (2) Backend monitors for deposits
    ▼
Detection Service
├─ WebSocket listeners on each chain
├─ Identifies user via memo/unique address
└─ Triggers conversion pipeline
    │
    │ (3) zkSwap conversion
    ▼
Conversion Pipeline
├─ Swap to USDC on source chain
│   └─ Jupiter (Solana), Uniswap (Ethereum)
├─ Bridge USDC to Base network
│   └─ Wormhole or Across Protocol
└─ USDC arrives in operator Base wallet
    │
    │ (4) Credit user account
    ▼
Database Update
├─ credit_transactions: status = "credited"
└─ users: credit_balance += amount_usd
    │
    │ (5) Notify user
    ▼
Frontend Update
└─ Dashboard shows new balance
```

**Detailed Steps:**

**Step 1: User Initiates Top-Up**
```
User Action:
- Click "Add Credits" in dashboard
- Select amount (e.g., $10)
- Choose crypto (SOL/BTC/ETH/BNB/etc)

Backend Response:
{
  "depositAddress": "HGqcFDAhXc6zdVgoag88oVQdtbYL5GW...",
  "amount": 0.05,
  "crypto": "SOL",
  "expectedUSD": 10.00,
  "expiresAt": "2025-10-26T15:00:00Z"
}
```

**Step 2: Blockchain Monitoring**
```typescript
// Backend monitors operator wallets
const depositDetector = new DepositDetector({
  solana: 'HGqcFDAhXc6zdVgoag88oVQdtbYL5GW...',
  ethereum: '0xdd16Fcf9d3B678DF28189C3b70a679...',
  // ... other chains
});

depositDetector.on('deposit', async (event) => {
  const { txHash, amount, crypto, userIdentifier } = event;
  
  // Create transaction record
  await db.insert(creditTransactions).values({
    user_zk_commitment: userIdentifier,
    amount_usd: expectedUSD,
    crypto_paid: crypto,
    crypto_amount: amount,
    status: 'converting',
    tx_hash: txHash
  });
  
  // Trigger conversion
  await zkSwap.convert({
    from: crypto,
    to: 'USDC_BASE',
    amount: amount,
    userIdentifier: userIdentifier
  });
});
```

**Step 3: zkSwap Conversion**
```
Example: User sends 0.05 SOL

3.1 Swap SOL → USDC (Solana)
    Input: 0.05 SOL
    DEX: Jupiter Aggregator
    Output: ~10 USDC SPL
    Time: ~30 seconds
    
3.2 Bridge USDC → Base
    Input: 10 USDC SPL
    Bridge: Wormhole
    Output: 10 USDC Base
    Time: ~2 minutes
    Gas: Paid by operator
    
3.3 Arrive in Operator Base Wallet
    Address: 0xdd16Fcf9d3B678DF28189C3b70a679...
    Balance: +10 USDC
```

**Step 4: Credit User Account**
```typescript
// After conversion completes
await db.transaction(async (tx) => {
  // Update transaction status
  await tx.update(creditTransactions)
    .set({ 
      status: 'credited',
      completed_at: new Date()
    })
    .where(eq(creditTransactions.tx_hash, txHash));
  
  // Update user balance
  await tx.update(users)
    .set({
      credit_balance: sql`credit_balance + ${amountUSD}`
    })
    .where(eq(users.zk_commitment, userCommitment));
});
```

**Status Tracking:**
```
Timeline for 0.05 SOL → $10 Credits:

T+0s    - User sends SOL
T+10s   - Deposit detected
          Status: "converting"
          
T+30s   - SOL → USDC swap complete
          
T+150s  - Bridge initiated
          
T+180s  - USDC arrives on Base
          Status: "credited"
          User balance updated
```

---

### Stage 2: Zekta → x402 Service (Service Purchase)

**Objective:** Use USDC Base to pay x402 service and deliver response to user

```
┌────────────────────────────────────────────────────────┐
│  STAGE 2: Credits → x402 Service Response             │
└────────────────────────────────────────────────────────┘

User Dashboard
    │
    │ (1) User clicks "Use OpenAI GPT-4o"
    │     Enters prompt
    ▼
Frontend
└─ POST /api/x402/purchase/:serviceId
   Body: { prompt, model, maxTokens }
    │
    │ (2) Backend validates & deducts credits
    ▼
Credit Deduction
├─ Check user balance >= service price
├─ Create purchase record (status: "created")
└─ Deduct credits (optimistic)
    │
    │ (3) Call x402 service (initial)
    ▼
x402 Service
└─ Returns: HTTP 402 Payment Required
   {
     "x402Version": 1,
     "accepts": [{
       "scheme": "exact",
       "network": "base",
       "maxAmountRequired": "30000",
       "recipient": "0xServiceWallet...",
       "facilitator": "https://x402.org/facilitator"
     }]
   }
    │
    │ (4) Create payment authorization
    ▼
ERC-3009 Signature
├─ operatorWallet.signTypedData({
│    transferWithAuthorization: {
│      from: operatorWallet.address,
│      to: serviceRecipient,
│      value: 30000,  // 0.03 USDC
│      validAfter: Math.floor(Date.now() / 1000),
│      validBefore: Math.floor(Date.now() / 1000) + 300,
│      nonce: crypto.randomBytes(32)
│    }
│  })
└─ Returns: { v, r, s } signature
    │
    │ (5) Submit to facilitator
    ▼
CDP Facilitator
POST /facilitator/verify
Body: {
  paymentPayload: { signature, from, to, value, ... },
  paymentRequirements: { scheme, network, amount, ... }
}
Response: {
  verified: true,
  proof: "base64encodedproof..."
}
    │
    │ (6) Retry service with proof
    ▼
x402 Service (with payment)
POST /service-endpoint
Headers: {
  "X-PAYMENT": "base64encodedproof...",
  "Content-Type": "application/json"
}
Body: {
  "prompt": "Write a haiku...",
  "model": "gpt-4o"
}
    │
    │ (7) Facilitator settles on-chain
    ▼
Base Network
├─ Facilitator calls USDC contract
├─ transferWithAuthorization executed
├─ 0.03 USDC transferred
└─ Transaction hash: 0x7fa9c2b8...
    │
    │ (8) Service processes & responds
    ▼
Service Response
{
  "content": "Silent chains conceal...",
  "usage": {
    "tokens": 45,
    "cost": 0.03
  }
}
    │
    │ (9) Backend saves & returns
    ▼
Database Update
├─ x402_purchases: status = "completed"
├─ x402_purchases: response_data = {...}
└─ purchase_logs: Multiple entries
    │
    │ (10) User receives response
    ▼
Frontend Display
└─ Show response with usage stats
```

**Detailed Implementation:**

**Step 1-2: Request Validation**
```typescript
// POST /api/x402/purchase/:serviceId
app.post('/api/x402/purchase/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  const { requestData } = req.body;  // { prompt, model, etc }
  const userCommitment = req.user.zkCommitment;  // From auth middleware
  
  // Get service details
  const service = await db.query.x402Services.findFirst({
    where: eq(x402Services.id, serviceId)
  });
  
  // Check user balance
  const user = await db.query.users.findFirst({
    where: eq(users.zk_commitment, userCommitment)
  });
  
  if (user.credit_balance < service.price_per_call) {
    return res.status(402).json({ error: 'Insufficient credits' });
  }
  
  // Create purchase record
  const [purchase] = await db.insert(x402Purchases).values({
    user_zk_commitment: userCommitment,
    service_id: serviceId,
    request_data: requestData,
    status: 'created',
    price_usd: service.price_per_call
  }).returning();
  
  // Deduct credits (optimistic)
  await db.update(users)
    .set({ 
      credit_balance: sql`credit_balance - ${service.price_per_call}` 
    })
    .where(eq(users.zk_commitment, userCommitment));
  
  // Log
  await logPurchaseStep(purchase.id, 'payment_processing', 
    `Deducted $${service.price_per_call} from balance`);
  
  // Continue to x402 call...
});
```

**Step 3-4: x402 Payment Flow**
```typescript
// Call service (will return 402)
const initial = await fetch(service.endpoint_url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requestData)
});

if (initial.status !== 402) {
  throw new Error('Expected 402 Payment Required');
}

const paymentRequired = await initial.json();
const paymentReq = paymentRequired.accepts[0];  // Take first option

// Create ERC-3009 signature
const nonce = crypto.randomBytes(32);
const validAfter = Math.floor(Date.now() / 1000);
const validBefore = validAfter + 300;  // 5 minutes

const domain = {
  name: 'USD Coin',
  version: '2',
  chainId: 8453,  // Base mainnet
  verifyingContract: USDC_BASE_ADDRESS
};

const types = {
  TransferWithAuthorization: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'validAfter', type: 'uint256' },
    { name: 'validBefore', type: 'uint256' },
    { name: 'nonce', type: 'bytes32' }
  ]
};

const message = {
  from: operatorWallet.address,
  to: paymentReq.recipient,
  value: BigInt(paymentReq.maxAmountRequired),
  validAfter,
  validBefore,
  nonce: `0x${nonce.toString('hex')}`
};

const signature = await operatorWallet.signTypedData({
  domain,
  types,
  primaryType: 'TransferWithAuthorization',
  message
});

await logPurchaseStep(purchase.id, 'signing_payment',
  'Created ERC-3009 signature');
```

**Step 5-6: Facilitator Verification**
```typescript
// Submit to facilitator
const verifyRes = await fetch(`${paymentReq.facilitator}/verify`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    paymentPayload: {
      ...message,
      signature
    },
    paymentRequirements: paymentReq
  })
});

const { verified, proof } = await verifyRes.json();

if (!verified) {
  throw new Error('Payment verification failed');
}

await logPurchaseStep(purchase.id, 'verifying_payment',
  'Payment verified by facilitator');

// Retry service with proof
const serviceRes = await fetch(service.endpoint_url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-PAYMENT': Buffer.from(JSON.stringify(proof)).toString('base64')
  },
  body: JSON.stringify(requestData)
});

const responseData = await serviceRes.json();

await logPurchaseStep(purchase.id, 'completed',
  'Response received from service');
```

**Step 7-10: Settlement & Response**
```typescript
// Update purchase record
await db.update(x402Purchases)
  .set({
    response_data: responseData,
    status: 'completed',
    completed_at: new Date(),
    x402_tx_hash: proof.txHash,  // From facilitator
    facilitator_used: 'CDP'
  })
  .where(eq(x402Purchases.id, purchase.id));

// Return to user
res.json({
  success: true,
  purchaseId: purchase.id,
  response: responseData
});
```

---

### Payment Flow Timing

**Stage 1 (Credit Top-Up):**
```
User sends crypto → Credits available
Time: 2-5 minutes (varies by blockchain/bridge)

Breakdown:
- SOL deposit detection: ~10 seconds
- SOL → USDC swap: ~30 seconds
- Bridge to Base: ~2 minutes
- Total: ~2.5 minutes

- BTC deposit: ~10 minutes (confirmation time)
- ETH deposit: ~3 minutes
```

**Stage 2 (Service Purchase):**
```
User clicks "Generate" → Response displayed
Time: 10-15 seconds

Breakdown:
- Initial 402 request: ~1 second
- Sign payment: <1 second
- Facilitator verify: ~2 seconds
- Settlement on Base: ~3 seconds
- Service processing: ~5-10 seconds (varies by service)
- Total: ~12 seconds
```

---

### Error Handling & Recovery

**Stage 1 Failures:**
```typescript
// Insufficient deposit
if (receivedAmount < expectedAmount) {
  status = 'failed';
  message = 'Deposit amount too low';
  // Refund logic (if applicable)
}

// Conversion failure
if (swapFailed) {
  status = 'failed';
  message = 'Swap failed - contact support';
  // Operator manually processes refund
}

// Bridge timeout
if (bridgeTimeout > 10min) {
  status = 'converting';  // Keep as pending
  message = 'Bridge delayed - please wait';
  // Automatic retry logic
}
```

**Stage 2 Failures:**
```typescript
// Insufficient balance (caught early)
if (balance < price) {
  return { error: 'Insufficient credits' };
  // No database changes
}

// Facilitator rejection
if (!verified) {
  // Refund credits
  await db.update(users).set({
    credit_balance: sql`credit_balance + ${price}`
  });
  
  status = 'failed';
  message = 'Payment verification failed';
}

// Service timeout
if (serviceTimeout > 30s) {
  // Refund credits
  // Mark purchase as failed
  status = 'failed';
  message = 'Service timeout - credits refunded';
}
```

---

## API Endpoints

### Authentication Endpoints

#### `POST /api/auth/create-identity`

**Purpose:** Generate new Semaphore ZK identity

**Request:**
```json
{}
```

**Response:**
```json
{
  "commitment": "0x5b3a7f2164e8c9d4a2f8b7e3c6d1a5f9e2b4c7d8",
  "trapdoor": "0xsecret_key_here...",
  "message": "Save your trapdoor securely!"
}
```

**Implementation:**
```typescript
app.post('/api/auth/create-identity', async (req, res) => {
  const identity = new Identity();
  const commitment = identity.commitment.toString();
  
  // Create user record
  await db.insert(users).values({
    zk_commitment: commitment,
    credit_balance: 0
  });
  
  res.json({
    commitment,
    trapdoor: identity.trapdoor.toString(),
    message: 'Save your trapdoor securely!'
  });
});
```

---

#### `POST /api/auth/verify-proof`

**Purpose:** Verify ZK proof and create session

**Request:**
```json
{
  "proof": {
    "merkleTreeDepth": 20,
    "merkleTreeRoot": "0x...",
    "nullifier": "0x...",
    "message": "login",
    "scope": "zekta-auth",
    "points": ["0x...", "0x..."]
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionToken": "jwt_token_here",
  "user": {
    "commitment": "0x5b3a...",
    "creditBalance": 10.00
  }
}
```

---

### Credits Endpoints

#### `GET /api/credits/balance`

**Purpose:** Get current credit balance

**Headers:**
```
Authorization: Bearer <session_token>
```

**Response:**
```json
{
  "balance": 9.97,
  "currency": "USD"
}
```

---

#### `POST /api/credits/topup`

**Purpose:** Initiate credit top-up

**Request:**
```json
{
  "amountUSD": 10,
  "crypto": "SOL"
}
```

**Response:**
```json
{
  "depositAddress": "HGqcFDAhXc6zdVgoag88oVQdtbYL5GW...",
  "expectedAmount": 0.05,
  "crypto": "SOL",
  "amountUSD": 10,
  "expiresAt": "2025-10-26T15:00:00Z",
  "transactionId": 123
}
```

---

#### `GET /api/credits/transactions`

**Purpose:** Get credit transaction history

**Query Params:**
- `limit` (default: 20)
- `offset` (default: 0)

**Response:**
```json
{
  "transactions": [
    {
      "id": 123,
      "amount": 10.00,
      "crypto": "SOL",
      "cryptoAmount": 0.05,
      "status": "credited",
      "txHash": "5Kn3Z7X...",
      "createdAt": "2025-10-26T14:30:00Z",
      "completedAt": "2025-10-26T14:32:00Z"
    }
  ],
  "total": 5
}
```

---

### x402 Service Endpoints

#### `GET /api/x402/services`

**Purpose:** List available services

**Query Params:**
- `category` (optional): AI, Data, Web3
- `search` (optional): search by name/description

**Response:**
```json
{
  "services": [
    {
      "id": "openai-gpt4",
      "name": "OpenAI GPT-4o",
      "description": "Advanced AI text generation",
      "category": "AI",
      "pricePerCall": 0.03,
      "provider": "Daydreams Router",
      "network": "base"
    },
    {
      "id": "firecrawl",
      "name": "Firecrawl",
      "description": "Web scraping service",
      "category": "Data",
      "pricePerCall": 0.01,
      "provider": "Firecrawl",
      "network": "base"
    }
  ]
}
```

---

#### `GET /api/x402/services/:id`

**Purpose:** Get service details

**Response:**
```json
{
  "id": "openai-gpt4",
  "name": "OpenAI GPT-4o",
  "description": "Advanced AI text generation with GPT-4o model",
  "category": "AI",
  "pricePerCall": 0.03,
  "provider": "Daydreams Router",
  "facilitator": "https://x402.org/facilitator",
  "network": "base",
  "endpointUrl": "https://daydreams.x402.com/openai",
  "inputSchema": {
    "prompt": "string",
    "model": "string (optional)",
    "maxTokens": "number (optional)"
  },
  "exampleRequest": {
    "prompt": "Write a haiku about blockchain",
    "model": "gpt-4o",
    "maxTokens": 500
  }
}
```

---

#### `POST /api/x402/purchase/:serviceId`

**Purpose:** Execute service call

**Request:**
```json
{
  "requestData": {
    "prompt": "Write a haiku about blockchain privacy",
    "model": "gpt-4o",
    "maxTokens": 500
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "purchaseId": 42,
  "response": {
    "content": "Silent chains conceal,\nProofs without revealing truth,\nPrivacy's quiet shield.",
    "usage": {
      "tokens": 45,
      "cost": 0.03
    }
  },
  "metadata": {
    "processingTime": "12s",
    "txHash": "0x7fa9c2b8..."
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Insufficient credits",
  "requiredCredits": 0.03,
  "currentBalance": 0.00
}
```

---

#### `GET /api/x402/purchases`

**Purpose:** Get purchase history

**Query Params:**
- `limit` (default: 20)
- `offset` (default: 0)
- `status` (optional): filter by status

**Response:**
```json
{
  "purchases": [
    {
      "id": 42,
      "serviceId": "openai-gpt4",
      "serviceName": "OpenAI GPT-4o",
      "status": "completed",
      "priceUSD": 0.03,
      "requestData": {
        "prompt": "Write a haiku..."
      },
      "createdAt": "2025-10-26T14:45:00Z",
      "completedAt": "2025-10-26T14:45:12Z"
    }
  ],
  "total": 15
}
```

---

#### `GET /api/x402/purchases/:id`

**Purpose:** Get detailed purchase info including logs

**Response:**
```json
{
  "id": 42,
  "serviceId": "openai-gpt4",
  "serviceName": "OpenAI GPT-4o",
  "status": "completed",
  "priceUSD": 0.03,
  "requestData": {
    "prompt": "Write a haiku about blockchain privacy",
    "model": "gpt-4o",
    "maxTokens": 500
  },
  "responseData": {
    "content": "Silent chains conceal...",
    "usage": {
      "tokens": 45,
      "cost": 0.03
    }
  },
  "x402TxHash": "0x7fa9c2b8...",
  "facilitatorUsed": "CDP",
  "createdAt": "2025-10-26T14:45:00Z",
  "completedAt": "2025-10-26T14:45:12Z",
  "logs": [
    {
      "timestamp": "2025-10-26T14:45:00Z",
      "status": "created",
      "message": "Order created for OpenAI GPT-4o"
    },
    {
      "timestamp": "2025-10-26T14:45:01Z",
      "status": "payment_processing",
      "message": "Deducting $0.03 from balance"
    },
    {
      "timestamp": "2025-10-26T14:45:12Z",
      "status": "completed",
      "message": "Response received from service"
    }
  ]
}
```

---

### Dashboard Endpoints

#### `GET /api/dashboard/stats`

**Purpose:** Get user statistics

**Response:**
```json
{
  "creditBalance": 9.97,
  "totalSpent": 0.13,
  "totalPurchases": 5,
  "thisMonth": {
    "purchases": 5,
    "spent": 0.13
  },
  "favoriteServices": [
    {
      "serviceId": "openai-gpt4",
      "serviceName": "OpenAI GPT-4o",
      "count": 3
    }
  ]
}
```

---

## User Journey

### Complete User Flow Walkthrough

#### **Step 1: Discovery (No Auth Required)**

```
User lands on: https://zekta.io

┌────────────────────────────────────────┐
│  ZEKTA - Zero-Knowledge Action Layer   │
│                                        │
│  Access Premium AI Services            │
│  Anonymously. Pay with Any Crypto.     │
│                                        │
│  [Browse Services] [Get Started]       │
└────────────────────────────────────────┘

Services Showcase:
  🤖 OpenAI GPT-4o    - $0.03/call
  🧠 Claude 4         - $0.04/call
  🌐 Firecrawl        - $0.01/call
  
User clicks "Browse Services" →
```

---

#### **Step 2: Service Marketplace**

```
/x402 page (Public - No Login Required)

┌────────────────────────────────────────┐
│ x402 Service Marketplace               │
│                                        │
│ Categories: [All] [AI] [Data] [Web3]  │
│ Search: [____________]                 │
└────────────────────────────────────────┘

┌──────────────────────────────┐
│ 🤖 OpenAI GPT-4o             │
│ Advanced AI text generation  │
│                              │
│ $0.03 per call              │
│ Provider: Daydreams Router   │
│                              │
│ [Try Now] ← User clicks      │
└──────────────────────────────┘

Authentication modal appears →
```

---

#### **Step 3: Authentication**

```
┌────────────────────────────────────────┐
│ 🔐 Anonymous Login Required            │
│                                        │
│ To use x402 services, create your     │
│ anonymous ZK identity                  │
│                                        │
│ ✓ No email or personal info           │
│ ✓ Fully private & anonymous            │
│ ✓ Secure Semaphore protocol            │
│                                        │
│ [Create ZK Identity] [I Have One]      │
└────────────────────────────────────────┘

NEW USER clicks "Create ZK Identity":
────────────────────────────────────────

Backend:
  POST /api/auth/create-identity
  Response: {
    commitment: "0x5b3a7f2164e8c9d4a2f8b7e3c6d1a5f9",
    trapdoor: "0xsecret_key_here..."
  }

Frontend shows:
┌────────────────────────────────────────┐
│ ⚡ Identity Created!                   │
│                                        │
│ ⚠️ SAVE YOUR SECRET KEY                │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ 0x5b3a7f2164e8c...9d4a2f           │ │
│ │ [Copy] [Download]                  │ │
│ └────────────────────────────────────┘ │
│                                        │
│ This is your ONLY way to recover      │
│ access. Store it safely!               │
│                                        │
│ ☑️ I've saved my secret key            │
│                                        │
│ [Continue to Dashboard]                │
└────────────────────────────────────────┘
```

---

#### **Step 4: Empty Dashboard**

```
Redirect to: /dashboard

┌────────────────────────────────────────┐
│ 👤 Anonymous User #42069               │
│ 🔑 ZK ID: 0x5b3a...7f21                │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ 💰 Credits: $0.00 USDC             │ │
│ │                                    │ │
│ │ Get started by adding credits!     │ │
│ │                                    │ │
│ │ [+ Add Credits] ← User clicks      │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Tabs:                                  │
│ [Playground] [History] [Settings]      │
└────────────────────────────────────────┘
```

---

#### **Step 5: Credit Top-Up**

```
Modal opens:
┌────────────────────────────────────────┐
│ 💳 Add Credits to Your Account         │
│                                        │
│ Amount (USD):                          │
│ [___$10____]                           │
│                                        │
│ Quick amounts:                         │
│ [$10] [$25] [$50] [$100]               │
│                                        │
│ Pay with:                              │
│ ⚪ SOL     (0.05 SOL)                  │
│ ⚪ BTC     (0.00015 BTC)               │
│ ⚪ ETH     (0.003 ETH)                 │
│ ⚪ ZEKTA   (20 ZEKTA)                  │
│                                        │
│ [Continue] ← User selects SOL & clicks │
└────────────────────────────────────────┘

Backend call:
  POST /api/credits/topup
  Body: { amountUSD: 10, crypto: "SOL" }
  
  Response: {
    depositAddress: "HGqcFDAhXc6zdVgoag88...",
    expectedAmount: 0.05,
    transactionId: 123
  }

Next screen:
┌────────────────────────────────────────┐
│ 💸 Send Payment                        │
│                                        │
│ Send exactly:                          │
│ ┌────────────────────────────────────┐ │
│ │ 0.05 SOL                           │ │
│ │ [Copy Amount]                      │ │
│ └────────────────────────────────────┘ │
│                                        │
│ To this address:                       │
│ ┌────────────────────────────────────┐ │
│ │ HGqcFDAhXc6zdVgoag88oVQdtbYL5GW... │ │
│ │ [Copy Address] [Show QR]           │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ⏳ Waiting for payment...              │
│                                        │
│ Status: Monitoring blockchain          │
└────────────────────────────────────────┘

User opens Phantom wallet →
  Sends 0.05 SOL to address
  Transaction confirmed

Backend detects deposit:
  WebSocket listener triggers
  
Modal updates (real-time):
┌────────────────────────────────────────┐
│ ✅ Payment Detected!                   │
│                                        │
│ Processing your deposit:               │
│                                        │
│ ✓ 1/3 Payment received                 │
│ 🔄 2/3 Converting to USDC Base...      │
│ ⏳ 3/3 Adding credits...               │
│                                        │
│ Estimated time: 2 minutes              │
└────────────────────────────────────────┘

~2 minutes later:
┌────────────────────────────────────────┐
│ 🎉 Credits Added Successfully!         │
│                                        │
│ +$10.00 USDC                           │
│                                        │
│ New Balance: $10.00                    │
│                                        │
│ [Start Using Services]                 │
└────────────────────────────────────────┘

Dashboard auto-updates:
  💰 Credits: $10.00 USDC ✨
```

---

#### **Step 6: Using Services (Playground)**

```
User navigates to: Playground tab

┌────────────────────────────────────────┐
│ 🎮 Playground                          │
│                                        │
│ Try x402 services instantly            │
│                                        │
│ Popular Services:                      │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ 🤖 OpenAI GPT-4o                   │ │
│ │ AI text generation                 │ │
│ │ $0.03/call                         │ │
│ │ [Use Now] ← User clicks            │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘

Service modal:
┌────────────────────────────────────────┐
│ 🤖 OpenAI GPT-4o                       │
│                                        │
│ Your prompt:                           │
│ ┌────────────────────────────────────┐ │
│ │ Write a haiku about blockchain     │ │
│ │ privacy and zero-knowledge proofs  │ │
│ │                                    │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Settings:                              │
│ Model: [GPT-4o ▼]                      │
│ Max tokens: [500____]                  │
│                                        │
│ 💰 Cost: $0.03                         │
│ Your balance: $10.00                   │
│                                        │
│ [Generate Response] 🚀 ← User clicks   │
└────────────────────────────────────────┘

Backend call:
  POST /api/x402/purchase/openai-gpt4
  Body: {
    requestData: {
      prompt: "Write a haiku about...",
      model: "gpt-4o",
      maxTokens: 500
    }
  }

Processing overlay:
┌────────────────────────────────────────┐
│ ⚡ Processing Your Request...          │
│                                        │
│ ✓ Deducting credits ($0.03)            │
│ ✓ Calling x402 service                 │
│ 🔄 Payment verification...             │
│ ⏳ Generating response...              │
│                                        │
│ This may take 10-15 seconds            │
└────────────────────────────────────────┘

~12 seconds later:
┌────────────────────────────────────────┐
│ ✅ Response Generated                  │
│                                        │
│ 🤖 GPT-4o Response:                    │
│ ┌────────────────────────────────────┐ │
│ │ Silent chains conceal,             │ │
│ │ Proofs without revealing truth,    │ │
│ │ Privacy's quiet shield.            │ │
│ └────────────────────────────────────┘ │
│                                        │
│ 📊 Stats:                              │
│ • Tokens used: 45                      │
│ • Cost: $0.03                          │
│ • Time: 12 seconds                     │
│                                        │
│ [Copy Text] [View Logs] [Try Again]    │
└────────────────────────────────────────┘

Balance auto-updates:
  💰 Credits: $9.97 USDC
```

---

#### **Step 7: Purchase History**

```
User navigates to: History tab

┌────────────────────────────────────────┐
│ 📜 Purchase History                    │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ Oct 26, 2025 - 2:45 PM             │ │
│ │ ────────────────────────────────── │ │
│ │ 🤖 OpenAI GPT-4o                   │ │
│ │ "Write a haiku about..."           │ │
│ │                                    │ │
│ │ Status: ✅ Completed                │ │
│ │ Cost: $0.03                        │ │
│ │ Response time: 12s                 │ │
│ │                                    │ │
│ │ [View Response] [View Logs] ← Click│ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ Oct 26, 2025 - 2:30 PM             │ │
│ │ ────────────────────────────────── │ │
│ │ 💰 Credit Top-Up                   │ │
│ │ +$10.00 via SOL                    │ │
│ │                                    │ │
│ │ Status: ✅ Completed                │ │
│ │ Tx: 5Kn3Z7X...                     │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘

User clicks "View Logs":
┌────────────────────────────────────────┐
│ 🔍 Transaction Details                 │
│ Purchase ID: #00042                    │
│                                        │
│ Timeline:                              │
│ ✓ 14:45:00 - Order created             │
│ ✓ 14:45:01 - Credits deducted ($0.03)  │
│ ✓ 14:45:02 - Calling x402 service      │
│ ✓ 14:45:03 - 402 Payment Required      │
│ ✓ 14:45:04 - Signing payment           │
│ ✓ 14:45:05 - Facilitator verification  │
│ ✓ 14:45:08 - Payment settled           │
│ ✓ 14:45:12 - Response received         │
│ ✓ 14:45:12 - Delivered to user         │
│                                        │
│ x402 Details:                          │
│ • Service: daydreams.x402.com          │
│ • Facilitator: CDP (Coinbase)          │
│ • Network: Base                        │
│ • Tx Hash: 0x7fa9c2...                 │
│                                        │
│ [View on Basescan] [Export JSON]       │
└────────────────────────────────────────┘
```

---

### User Journey Timeline Summary

```
Complete User Journey:
══════════════════════════════════════════

T+0:00  - Land on homepage
T+0:30  - Browse x402 marketplace
T+1:00  - Click "Try OpenAI"
T+1:05  - Create ZK identity
T+1:30  - Reach dashboard (empty)
T+2:00  - Click "Add Credits"
T+2:15  - Select SOL, get deposit address
T+2:30  - Send 0.05 SOL from Phantom
T+4:30  - Credits added ($10) ✅
T+5:00  - Navigate to Playground
T+5:30  - Use OpenAI GPT-4o
T+5:45  - Enter prompt, click Generate
T+6:00  - Response received! ✅
T+6:30  - Check History tab
T+7:00  - View detailed logs

Total time: ~7 minutes
User now has: $9.97 credits remaining
User experience: Fully anonymous, no KYC
```

---

## Viewing x402 Transactions

### Transaction Explorer: x402scan.com

All x402 payment settlements are recorded on-chain (Base network) and can be viewed publicly for transparency and verification.

**x402scan.com Features:**
- View all x402 payment transactions
- Track service purchases and settlements
- Verify facilitator activity (CDP, PayAI, etc.)
- Check payment proofs and receipts
- Monitor service provider activity

---

### How to View Your Transactions

**From Purchase History:**

When a user completes a service purchase, they receive a transaction hash (`x402_tx_hash`) in their purchase details:

```json
{
  "purchaseId": 42,
  "status": "completed",
  "x402TxHash": "0x7fa9c2b8e1d3a4f6c9b2e5d8a1c4f7b0",
  "facilitatorUsed": "CDP"
}
```

**View on x402scan:**
1. Copy the transaction hash from purchase logs
2. Visit: `https://x402scan.com/tx/0x7fa9c2b8...`
3. View complete payment details

---

### Transaction Details Available

**On x402scan.com, users can see:**

**Payment Information:**
- Amount paid (USDC on Base network)
- Service recipient address
- Facilitator used (CDP/PayAI/etc)
- Payment authorization signature

**Service Details:**
- Service endpoint called
- Service provider information
- Request timestamp
- Settlement timestamp

**On-Chain Verification:**
- Base network transaction hash
- Block number
- Gas fees (paid by operator)
- Smart contract interactions (USDC ERC-3009)

---

### Example Transaction View

```
x402scan.com/tx/0x7fa9c2b8e1d3a4f6c9b2e5d8a1c4f7b0
═══════════════════════════════════════════════════════

Transaction Details
───────────────────────────────────────────────────────
Status:          ✅ Completed
Type:            x402 Payment Settlement
Network:         Base Mainnet
Block:           12,345,678
Timestamp:       Oct 26, 2025 14:45:12 UTC

Payment Information
───────────────────────────────────────────────────────
Amount:          0.03 USDC
From:            0xdd16Fcf9d3B678DF28189C3b70a679... (Zekta Operator)
To:              0xService... (Daydreams Router)
Facilitator:     CDP (Coinbase Digital Payments)
Method:          ERC-3009 transferWithAuthorization

Service Details
───────────────────────────────────────────────────────
Service:         OpenAI GPT-4o
Endpoint:        https://daydreams.x402.com/openai
Provider:        Daydreams Router
Category:        AI / Text Generation

On-Chain Data
───────────────────────────────────────────────────────
Transaction Hash: 0x7fa9c2b8e1d3a4f6c9b2e5d8a1c4f7b0
Gas Used:        45,231
Gas Price:       0.25 gwei
Total Gas Fee:   0.000011 ETH (paid by operator)

Smart Contract Interactions
───────────────────────────────────────────────────────
1. USDC Contract (Base)
   - transferWithAuthorization()
   - Amount: 30,000 units (0.03 USDC)
   - Authorized by: 0xdd16Fcf9...
   - Executed by: CDP Facilitator

2. x402 Facilitator (CDP)
   - verifyPayment()
   - Settlement proof generated
   - Service notified
```

---

### Use Cases for x402scan

**For Users:**
- **Verify Payments:** Confirm your service purchase was settled on-chain
- **Track History:** View all your anonymous purchases (via tx hashes)
- **Dispute Resolution:** Provide proof of payment if service fails
- **Transparency:** See exactly where your USDC went

**For Developers:**
- **Debug Integration:** Check if x402 payments are being created correctly
- **Monitor Services:** Track your service's x402 activity
- **Audit Payments:** Verify facilitator settlements
- **Analytics:** Analyze payment patterns and volumes

**For Auditors:**
- **Public Verification:** All transactions are publicly viewable
- **Service Reliability:** Track success/failure rates
- **Payment Flows:** Understand how x402 protocol works
- **Facilitator Activity:** Monitor facilitator performance

---

### Privacy Considerations

**What's Public on x402scan:**
- ✅ Transaction hash
- ✅ Payment amount (USDC)
- ✅ Operator wallet address (Zekta's)
- ✅ Service provider address
- ✅ Facilitator used
- ✅ Timestamp

**What's Private:**
- 🔒 User identity (anonymous ZK commitment)
- 🔒 User wallet address (never exposed)
- 🔒 Request data (prompts, inputs)
- 🔒 Response data (outputs)
- 🔒 User's credit balance

**Key Point:** x402scan shows **payment settlements only**. The actual service request/response data and user identity remain private. Only the Zekta operator wallet and service provider addresses are visible.

---

### Integration in Zekta Platform

**Purchase Logs Include x402scan Link:**

When users view their purchase details, we provide direct links:

```typescript
// In purchase detail modal
<div className="mt-4">
  <h4>Transaction Verification</h4>
  <a 
    href={`https://x402scan.com/tx/${purchase.x402_tx_hash}`}
    target="_blank"
    className="text-blue-500 hover:underline"
  >
    View on x402scan ↗
  </a>
</div>
```

**Button in Purchase History:**
```
┌────────────────────────────────────┐
│ Purchase #42 - OpenAI GPT-4o       │
│ Status: ✅ Completed                │
│ Cost: $0.03                        │
│                                    │
│ [View Response] [View on x402scan] │
└────────────────────────────────────┘
```

---

### Alternative: Basescan

Since x402 transactions settle on **Base network**, they're also visible on standard Base block explorers:

**Basescan (Base):**
- URL: `https://basescan.org/tx/0x7fa9c2b8...`
- Shows raw Base network transaction
- Less x402-specific context
- Standard EVM transaction details

**x402scan vs Basescan:**

| Feature | x402scan.com | basescan.org |
|---------|-------------|--------------|
| x402-specific UI | ✅ Yes | ❌ No |
| Service details | ✅ Shows service info | ❌ Raw transaction |
| Facilitator info | ✅ Highlighted | ❌ Just addresses |
| User-friendly | ✅ For x402 users | ⚠️ For blockchain devs |
| Payment context | ✅ Full x402 context | ❌ Generic EVM tx |

**Recommendation:** Use **x402scan.com** for better user experience and x402-specific details. Use **basescan.org** for low-level blockchain verification.

---

## Security Architecture

### Zero-Knowledge Authentication (Semaphore)

**Protocol:** Semaphore v4.13.1  
**Curve:** Baby JubJub (EdDSA)  
**Hash Function:** Poseidon

**Identity Generation (Client-Side):**
```typescript
import { Identity } from '@semaphore-protocol/identity';

// Generate new identity
const identity = new Identity();

// Components
const trapdoor = identity.trapdoor;     // Secret (save offline)
const nullifier = identity.nullifier;   // Secret
const commitment = identity.commitment; // Public identifier

// User stores trapdoor locally (browser storage or download)
localStorage.setItem('zekta_trapdoor', trapdoor.toString());
```

**Proof Generation:**
```typescript
import { Group } from '@semaphore-protocol/group';
import { generateProof } from '@semaphore-protocol/proof';

// Create group (membership set)
const group = new Group(groupId, 20);  // Merkle tree depth 20

// Add user commitment to group
group.addMember(commitment);

// Generate proof of membership
const signal = "login_request";
const scope = "zekta-auth";

const proof = await generateProof(identity, group, signal, scope);
```

**Proof Verification (Server-Side):**
```typescript
import { verifyProof } from '@semaphore-protocol/proof';

// Verify ZK proof
const verified = await verifyProof(proof, {
  merkleTreeDepth: 20,
  expectedRoot: group.root,
  expectedSignal: signal,
  expectedScope: scope
});

if (verified) {
  // Create session
  const sessionToken = jwt.sign({
    commitment: proof.publicSignals.commitment,
    nullifier: proof.publicSignals.nullifier
  }, SECRET_KEY, { expiresIn: '7d' });
}
```

**Privacy Guarantees:**
- No PII (Personally Identifiable Information) required
- Commitment is cryptographic hash (unlinkable to real identity)
- Proof reveals membership without revealing which member
- Nullifier prevents double-signaling (replay attacks)

---

### Payment Security (ERC-3009)

**Standard:** ERC-3009 (USDC Transfer Authorization)  
**Network:** Base Mainnet  
**Token:** USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)

**Authorization Structure:**
```typescript
interface TransferWithAuthorization {
  from: address;         // Sender (operator wallet)
  to: address;          // Recipient (service provider)
  value: uint256;       // Amount (in atomic units)
  validAfter: uint256;  // Unix timestamp (start)
  validBefore: uint256; // Unix timestamp (end)
  nonce: bytes32;       // Unique nonce (prevent replay)
}
```

**EIP-712 Typed Data Signing:**
```typescript
const domain = {
  name: 'USD Coin',
  version: '2',
  chainId: 8453,  // Base mainnet
  verifyingContract: USDC_ADDRESS
};

const types = {
  TransferWithAuthorization: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'validAfter', type: 'uint256' },
    { name: 'validBefore', type: 'uint256' },
    { name: 'nonce', type: 'bytes32' }
  ]
};

const signature = await wallet.signTypedData({
  domain,
  types,
  primaryType: 'TransferWithAuthorization',
  message: {
    from: operatorWallet.address,
    to: serviceRecipient,
    value: 30000,  // 0.03 USDC
    validAfter: Math.floor(Date.now() / 1000),
    validBefore: Math.floor(Date.now() / 1000) + 300,
    nonce: crypto.randomBytes(32)
  }
});
```

**Security Features:**
1. **Time-Bound Authorization:**
   - `validAfter`: Prevents premature execution
   - `validBefore`: Automatic expiry (5 min default)
   - Protects against delayed settlement attacks

2. **Nonce System:**
   - Cryptographically random 32 bytes
   - Prevents replay attacks
   - One-time use guarantee

3. **Facilitator Constraints:**
   - Cannot move funds beyond authorization
   - Cannot change recipient
   - Cannot increase amount
   - Transparent on-chain verification

4. **Gas Abstraction:**
   - User never pays gas
   - Operator sponsors all transactions
   - Seamless UX (no wallet popups)

---

### Data Security

**Database Encryption:**
- PostgreSQL TLS connections (Neon enforced)
- Encrypted at rest (Neon default)
- No credit card data stored (crypto only)

**Sensitive Data Handling:**
```typescript
// ZK commitments are public (safe to store)
zk_commitment: "0x5b3a7f2164..."  ✅

// Trapdoors NEVER stored on server
trapdoor: ONLY on client  ✅

// Credit balances are safe (not linked to identity)
credit_balance: 10.00  ✅

// Response data may contain sensitive info
response_data: encrypted_at_application_level  ⚠️
```

**API Security:**
- Rate limiting per ZK commitment
- JWT session tokens (7 day expiry)
- CORS restricted to zekta.io domain
- Input validation via Zod schemas

---

### Operational Security

**Operator Wallet Management:**
```
Hot Wallets (Online):
├─ Solana: For payment detection & swaps
├─ Base: For x402 USDC settlements
└─ Ethereum: Backup operations

Cold Storage (Offline):
└─ Revenue wallet (periodic sweeps)

Security Measures:
├─ Multi-sig for withdrawals (future)
├─ Daily balance monitoring
├─ Automated alerts for unusual activity
└─ Regular security audits
```

**Environment Secrets:**
```bash
# Never committed to git
EVM_HOT_WALLET_KEY=...
SOLANA_PRIVATE_KEY_B58=...

# Rotation policy: Every 90 days
JWT_SECRET=...

# Access control: Read-only for backend
DATABASE_URL=...
```

---

## Service Catalog

### AI Services

#### OpenAI GPT-4o
- **Provider:** Daydreams Router
- **Price:** $0.03/call
- **Endpoint:** https://daydreams.x402.com/openai
- **Input:** `{ prompt, model?, maxTokens? }`
- **Output:** `{ content, usage: { tokens, cost } }`
- **Use Case:** Text generation, Q&A, code generation

#### Claude 4
- **Provider:** Daydreams Router
- **Price:** $0.04/call
- **Endpoint:** https://daydreams.x402.com/claude
- **Input:** `{ prompt, model?, maxTokens? }`
- **Output:** `{ content, usage }`
- **Use Case:** Advanced reasoning, analysis

#### Gemini 2.5 Pro
- **Provider:** Daydreams Router
- **Price:** $0.03/call
- **Endpoint:** https://daydreams.x402.com/gemini
- **Input:** `{ prompt, multimodal? }`
- **Output:** `{ content, usage }`
- **Use Case:** Multimodal AI, vision + text

---

### Data Services

#### Firecrawl
- **Provider:** Firecrawl.dev
- **Price:** $0.01/call
- **Endpoint:** https://firecrawl.x402.com
- **Input:** `{ url, extractRules? }`
- **Output:** `{ markdown, metadata }`
- **Use Case:** Web scraping, data extraction

#### Zyte API
- **Provider:** Zyte
- **Price:** $0.02/call
- **Endpoint:** https://zyte.x402.com
- **Input:** `{ url, options }`
- **Output:** `{ html, screenshots? }`
- **Use Case:** Advanced scraping, JS rendering

#### Neynar
- **Provider:** Neynar.com
- **Price:** $0.005/call
- **Endpoint:** https://neynar.x402.com
- **Input:** `{ username | castId }`
- **Output:** `{ userData | castData }`
- **Use Case:** Farcaster social data

---

### Storage Services

#### Pinata
- **Provider:** Pinata.cloud
- **Price:** $0.005/upload
- **Endpoint:** https://402.pinata.cloud
- **Input:** `{ file, metadata }`
- **Output:** `{ ipfsHash, pinSize }`
- **Use Case:** IPFS file storage

---

### Web3 Services

#### AEON
- **Provider:** aeon.xyz
- **Price:** Variable
- **Endpoint:** https://aeon.x402.com
- **Input:** `{ recipient, amount, chain }`
- **Output:** `{ txHash, status }`
- **Use Case:** Omnichain payments

---

## Environment Setup

### Prerequisites

```bash
# Node.js
node --version  # v20.x required

# Package manager
npm --version   # or pnpm/bun

# PostgreSQL client (optional, for local dev)
psql --version
```

---

### Environment Variables

Create `.env` file:

```bash
# Database (Neon)
DATABASE_URL=postgresql://user:pass@host/db
PGHOST=host.neon.tech
PGUSER=user
PGPASSWORD=password
PGDATABASE=zekta
PGPORT=5432

# Blockchain - Solana
SOLANA_PRIVATE_KEY_B58=<base58_private_key>

# Blockchain - EVM (Base)
EVM_HOT_WALLET_KEY=<hex_private_key>

# Payment Services
SIMPLESWAP_API_KEY=<api_key>

# x402 Integration
X402_FACILITATOR_URL=https://x402.org/facilitator

# ZK Session (Semaphore)
ZK_SESSION_PRIVATE_KEY=<hex_key>
ZK_SESSION_PUBLIC_KEY=<hex_key>

# JWT
JWT_SECRET=<random_secret>

# Node Environment
NODE_ENV=development
```

---

### Installation

```bash
# Clone repository
git clone https://github.com/zekta/marketplace.git
cd marketplace

# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

**Development server runs on:**
- Frontend: http://localhost:5000
- Backend API: http://localhost:5000/api

---

### Database Setup

**Using Neon (Recommended):**
1. Create account at https://neon.tech
2. Create new project
3. Copy connection string to `DATABASE_URL`
4. Run `npm run db:push`

**Schema Sync:**
```bash
# Push schema changes
npm run db:push

# Force push (if conflicts)
npm run db:push --force

# Never manually write migrations
# Drizzle handles everything
```

---

## Development Workflow

### Project Structure

```
zekta/
├── client/                 # Frontend
│   ├── src/
│   │   ├── pages/         # Route components
│   │   │   ├── Home.tsx
│   │   │   ├── X402Marketplace.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── ...
│   │   ├── components/    # Reusable UI
│   │   │   ├── ui/        # shadcn components
│   │   │   ├── Header.tsx
│   │   │   └── ...
│   │   ├── lib/           # Utilities
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── App.tsx        # Main app + routing
│   │   └── index.css      # Global styles
│   └── index.html
├── server/                # Backend
│   ├── index.ts          # Entry point
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Database interface
│   ├── services/         # Business logic
│   │   ├── x402-client.ts
│   │   ├── zkswap.ts
│   │   └── semaphore.ts
│   └── middleware/
├── shared/               # Shared types
│   └── schema.ts         # Database schema + types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── drizzle.config.ts
└── vite.config.ts
```

---

### Development Commands

```bash
# Start dev server (HMR enabled)
npm run dev

# Type checking
npm run type-check

# Database
npm run db:push          # Sync schema
npm run db:push --force  # Force sync

# Build for production
npm run build

# Preview production build
npm run preview
```

---

### Code Style

**TypeScript:**
```typescript
// Use explicit types
const user: User = await getUser(id);

// Use async/await (not .then)
const data = await fetch(url);

// Use destructuring
const { commitment, balance } = user;

// Use optional chaining
const name = user?.profile?.name;
```

**React Components:**
```typescript
// Functional components with TypeScript
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

export function MyComponent({ title, onSubmit }: Props) {
  // Component logic
}

// Custom hooks
function useCredits() {
  return useQuery({
    queryKey: ['/api/credits/balance'],
    // ...
  });
}
```

**Database Queries:**
```typescript
// Use Drizzle ORM (type-safe)
const users = await db.query.users.findMany({
  where: eq(users.zk_commitment, commitment)
});

// Transactions for atomic operations
await db.transaction(async (tx) => {
  await tx.insert(purchases).values({...});
  await tx.update(users).set({...});
});
```

---

### Testing

**Manual Testing Checklist:**
- [ ] ZK identity creation & import
- [ ] Credit top-up flow (SOL/BTC/ETH)
- [ ] Service purchase & response
- [ ] Purchase history display
- [ ] Transaction logs accuracy
- [ ] Balance updates
- [ ] Error handling

**Future: Automated Tests**
- Unit tests (Vitest)
- Integration tests (Playwright)
- E2E tests (Cypress)

---

## Conclusion

The Zekta x402 Marketplace represents a convergence of:
- **Privacy Technology:** Zero-knowledge proofs via Semaphore
- **Decentralized Payments:** x402 protocol for API monetization
- **Multi-Chain Support:** Accept any crypto, pay with USDC Base
- **Developer Experience:** Type-safe, modern stack (React + Express + Drizzle)

**Key Innovations:**
✅ Anonymous authentication without PII  
✅ Multi-crypto payment acceptance (8+ supported)  
✅ Automatic conversion to x402-compatible USDC Base  
✅ Transparent transaction logging for auditability  
✅ Developer-friendly playground for instant testing  

**Future Roadmap:**
- API key system for developer integrations
- More x402 service integrations
- Enhanced analytics dashboard
- Multi-party computation for payments
- Decentralized facilitator options

---

**Document Version:** 1.0  
**Last Updated:** October 26, 2025  
**Maintained By:** Zekta Development Team  
**License:** Proprietary

---

*For questions or support, contact: support@zekta.io*
