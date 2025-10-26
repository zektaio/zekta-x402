# 📁 x402marketplace - Clean Structure

## ✅ ATURAN PENTING:

**SEMUA PERUBAHAN DI `/x402marketplace` (platform live) HARUS DI-SYNC KE FOLDER INI!**

Jadi kalau ada update di:
- `client/src/pages/X402Marketplace.tsx` → sync ke `x402marketplace/client/src/pages/X402Marketplace.tsx`
- `client/src/pages/X402Playground.tsx` → sync ke `x402marketplace/client/src/pages/X402Playground.tsx`
- `server/routes.ts` (endpoint x402) → sync ke `x402marketplace/server/routes.ts`
- dll.

---

## 📦 Complete Structure:

```
x402marketplace/                    ← FOLDER KHUSUS GITHUB
├── client/src/
│   ├── pages/
│   │   ├── X402Marketplace.tsx    ← MAIN MARKETPLACE (901 lines)
│   │   ├── X402Playground.tsx     ← SERVICE TESTING (330 lines)
│   │   ├── Landing.tsx            ← Homepage
│   │   ├── Docs.tsx               ← Documentation
│   │   └── not-found.tsx          ← 404 page
│   ├── components/                ← Shadcn UI (complete)
│   ├── lib/                       ← React Query client
│   ├── hooks/                     ← Custom hooks
│   ├── App.tsx                    ← CLEAN ROUTES (only x402)
│   ├── main.tsx                   ← Entry point
│   └── index.css                  ← Styles
├── server/
│   ├── x402-client.ts             ← x402 protocol integration
│   ├── db.ts                      ← Database connection
│   ├── storage.ts                 ← Data access layer
│   ├── wallet.ts                  ← Crypto payment handling
│   ├── eth-wallet.ts              ← Base network integration
│   ├── routes.ts                  ← API routes (x402 only)
│   ├── index.ts                   ← Server entry
│   └── vite.ts                    ← Vite server
├── shared/
│   └── schema.ts                  ← Database schema (x402 tables only)
├── public/                        ← Static assets
├── vite.config.ts                 ← Vite configuration
├── tsconfig.json                  ← TypeScript config
├── tailwind.config.ts             ← Tailwind CSS config
├── postcss.config.js              ← PostCSS config
├── drizzle.config.ts              ← Drizzle ORM config
├── package.json                   ← Dependencies
├── README.md                      ← Documentation
├── GITHUB_SYNC.md                 ← Sync instructions
├── STRUKTUR.md                    ← This file
└── .gitignore                     ← Git ignore rules
```

---

## 🔄 Workflow Update:

### 1. Kalo ada perubahan di platform `/x402marketplace`:
```bash
# Contoh: update X402Marketplace.tsx
cp client/src/pages/X402Marketplace.tsx x402marketplace/client/src/pages/

# Update README jika ada fitur baru
vi x402marketplace/README.md
```

### 2. Kalo mau push ke GitHub:
```bash
# Baca instruksi lengkap
cat x402marketplace/GITHUB_SYNC.md

# Copy ke repo atau paste manual
```

---

## ⚠️ YANG TIDAK BOLEH:

❌ Jangan edit files di `x402marketplace/` untuk development  
✅ Edit di workspace utama, SYNC ke `x402marketplace/`

❌ Jangan hapus fitur lain di workspace utama  
✅ Folder `x402marketplace/` terpisah, workspace utama tetap lengkap

---

## 📊 Database Tables (Clean):

1. **users** - Anonymous identities (zkCommitment, creditBalance)
2. **x402_services** - Marketplace services
3. **x402_purchases** - Purchase records
4. **credit_transactions** - Topup & spending logs

---

## 🎯 Routes (Clean):

1. `/` - Landing page
2. `/docs` - Documentation
3. `/x402marketplace` - Main marketplace
4. `/x402playground` - Service testing
5. `/*` - 404 Not Found

**NO DOMAIN, NO GIFTCARD, NO TWITTER, NO DEVELOPER PORTAL**  
**PURE X402 MARKETPLACE ONLY!** ✅
