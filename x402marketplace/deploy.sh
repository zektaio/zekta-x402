#!/bin/bash
git config user.name "Zekta"
git config user.email "dev@zekta.io"
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' ! -name 'x402marketplace' ! -name '.replit' ! -name 'replit.nix' -exec rm -rf {} + 2>/dev/null
cp -r x402marketplace/* .
cp x402marketplace/.gitignore . 2>/dev/null
rm -f replit.md
git add .
git commit -m "feat: clean x402 marketplace - production ready"
git push -f origin main
echo "✅ Done! https://github.com/zektaio/zekta-x402"
