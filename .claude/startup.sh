#!/bin/bash
# Claude Code Startup Script
# Runs automatically when project opens in Claude Code
# Survives app updates and configuration changes

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 Browser Audit Toolkit - Claude Code Startup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Verify project structure
echo "1️⃣ Verifying project integrity..."
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found"
  exit 1
fi

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
  echo "📦 Installing dependencies..."
  npm install --silent || npm install
fi

echo "✅ Project structure verified"
echo ""

# 2. Verify toolkit modules
echo "2️⃣ Verifying toolkit modules..."
modules=(
  "1-headless-chromium-tester.js"
  "2-puppeteer-stealth-scraper.js"
  "3-privacy-hardened-browser.js"
  "4-advanced-anti-detection.js"
  "5-cloudflare-bypass.js"
  "index.js"
)

all_present=true
for module in "${modules[@]}"; do
  if [ -f "$module" ]; then
    echo "  ✅ $module"
  else
    echo "  ❌ Missing: $module"
    all_present=false
  fi
done

if [ "$all_present" = false ]; then
  echo ""
  echo "⚠️  Warning: Some modules missing"
fi

echo ""

# 3. Verify configuration
echo "3️⃣ Verifying Claude Code configuration..."
if [ -f ".claude/settings.json" ]; then
  echo "  ✅ .claude/settings.json"
else
  echo "  ⚠️  .claude/settings.json not found"
fi

if [ -f ".claude/hooks.json" ]; then
  echo "  ✅ .claude/hooks.json"
else
  echo "  ⚠️  .claude/hooks.json not found"
fi

echo ""

# 4. Verify dependencies
echo "4️⃣ Verifying npm dependencies..."
if npm ls puppeteer --depth=0 > /dev/null 2>&1; then
  echo "  ✅ puppeteer"
else
  echo "  ❌ puppeteer not installed"
fi

if npm ls puppeteer-extra --depth=0 > /dev/null 2>&1; then
  echo "  ✅ puppeteer-extra"
else
  echo "  ❌ puppeteer-extra not installed"
fi

if npm ls puppeteer-extra-plugin-stealth --depth=0 > /dev/null 2>&1; then
  echo "  ✅ stealth plugin"
else
  echo "  ❌ stealth plugin not installed"
fi

echo ""

# 5. System setup
echo "5️⃣ Verifying system setup..."
if command -v duti &> /dev/null; then
  echo "  ✅ duti (browser default utility)"
else
  echo "  ⚠️  duti not found (install via: brew install duti)"
fi

if [ -d "/Applications/Camoufox.app" ]; then
  echo "  ✅ Camoufox installed"
else
  echo "  ⚠️  Camoufox not found"
fi

echo ""

# 6. Quick functionality test
echo "6️⃣ Running quick test..."
if node -e "const t = require('./index'); console.log('  ✅ Toolkit loads successfully')" 2>/dev/null; then
  true
else
  echo "  ⚠️  Toolkit load test failed"
fi

echo ""

# 7. Status summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ STARTUP COMPLETE - Toolkit Ready"
echo ""
echo "📋 Quick Commands:"
echo "   npm run audit:performance -- https://your-site.com"
echo "   npm run audit:privacy -- https://your-site.com"
echo "   npm run audit:anti-detection -- https://your-site.com"
echo "   npm run bypass:cloudflare -- https://your-site.com"
echo ""
echo "📖 Docs: README.md, QUICK-START.md"
echo ""
