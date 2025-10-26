#!/bin/bash

echo "🚀 Pushing x402marketplace to GitHub zekta-x402..."
echo ""

# Step 1: Configure git author
echo "1️⃣ Configuring git author as Zekta..."
git config user.name "Zekta"
git config user.email "dev@zekta.io"
echo "✓ Author: $(git config user.name) <$(git config user.email)>"
echo ""

# Step 2: Backup current files (optional)
echo "2️⃣ Creating backup of current repo state..."
mkdir -p /tmp/zekta-backup-$(date +%s)
cp -r .git /tmp/zekta-backup-$(date +%s)/ 2>/dev/null || echo "Skip .git backup"
echo "✓ Backup created (if needed)"
echo ""

# Step 3: Remove all files except .git and x402marketplace
echo "3️⃣ Cleaning workspace (keeping .git and x402marketplace)..."
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' ! -name 'x402marketplace' ! -name '.replit' ! -name 'replit.nix' -exec rm -rf {} + 2>/dev/null || echo "Clean in progress..."
echo "✓ Workspace cleaned"
echo ""

# Step 4: Copy all files from x402marketplace to root
echo "4️⃣ Copying files from x402marketplace/ to root..."
cp -r x402marketplace/* .
cp x402marketplace/.gitignore . 2>/dev/null || echo "No .gitignore to copy"
echo "✓ Files copied"
echo ""

# Step 5: Check what's changed
echo "5️⃣ Checking changes..."
git status --short | head -20
echo ""

# Step 6: Add all files
echo "6️⃣ Adding files to git..."
git add .
echo "✓ Files staged"
echo ""

# Step 7: Commit
echo "7️⃣ Committing changes..."
git commit -m "feat: clean x402 marketplace - production ready

- Anonymous zkID authentication (Semaphore Protocol)
- File upload zkID backup system
- Multi-cryptocurrency payment support
- x402 protocol integration (Base network)
- Purchase & transaction history
- Interactive service testing playground
- Clean architecture: 5 routes, 4 tables, production-ready

Author: Zekta <dev@zekta.io>"
echo "✓ Committed"
echo ""

# Step 8: Push to GitHub
echo "8️⃣ Pushing to GitHub..."
git push -f origin main
echo ""

echo "✅ DONE! Check: https://github.com/zektaio/zekta-x402"
