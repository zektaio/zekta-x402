#!/bin/bash

echo "Pushing clean x402 marketplace to GitHub..."
echo ""

# Configure git author
git config user.name "Zekta"
git config user.email "dev@zekta.io"
echo "Author: $(git config user.name) <$(git config user.email)>"
echo ""

# Clean workspace (keep .git and x402marketplace)
echo "Cleaning workspace..."
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' ! -name 'x402marketplace' ! -name '.replit' ! -name 'replit.nix' -exec rm -rf {} + 2>/dev/null
echo "✓ Cleaned"
echo ""

# Copy files from x402marketplace to root
echo "Copying files..."
cp -r x402marketplace/* .
cp x402marketplace/.gitignore . 2>/dev/null
echo "✓ Copied"
echo ""

# Remove replit.md if exists
rm -f replit.md
echo "✓ Removed replit.md"
echo ""

# Check changes
echo "Changes:"
git status --short | head -20
echo ""

# Add all files
git add .
echo "✓ Staged"
echo ""

# Commit
git commit -m "feat: clean x402 marketplace - production ready

- Anonymous zkID authentication (Semaphore Protocol)
- File upload zkID backup system
- Multi-cryptocurrency payment support
- x402 protocol integration (Base network)
- Purchase & transaction history
- Interactive service testing playground
- Clean architecture: 5 routes, 4 tables

Author: Zekta <dev@zekta.io>"
echo "✓ Committed"
echo ""

# Force push
echo "Pushing to GitHub..."
git push -f origin main
echo ""

echo "✅ DONE! https://github.com/zektaio/zekta-x402"
