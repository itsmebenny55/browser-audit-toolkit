#!/bin/bash
set -e

echo "🦊 Camoufox Setup for Browser Audit Toolkit"
echo "==========================================="
echo ""

# Check if camoufox is installed
if [ ! -d "/Applications/Camoufox.app" ]; then
    echo "❌ Camoufox not found at /Applications/Camoufox.app"
    echo "Install from: https://github.com/tombohub/camoufox"
    exit 1
fi

echo "✅ Camoufox detected at /Applications/Camoufox.app"

# Check if duti is installed
if ! command -v duti &> /dev/null; then
    echo "Installing duti for default browser configuration..."
    brew install duti
fi

# Set camoufox as default browser
echo "Setting camoufox as default browser..."
duti -s com.zero.camoufox public.html all
duti -s com.zero.camoufox public.url all
echo "✅ Camoufox set as default browser"

# Update npm dependencies
echo ""
echo "Installing npm dependencies..."
npm install

# Create environment config
echo ""
echo "Creating environment configuration..."
cat > .env.camoufox << 'EOF'
# Camoufox Configuration
USE_CAMOUFOX=true
CAMOUFOX_PATH=/Applications/Camoufox.app/Contents/MacOS/firefox
EOF

echo "✅ Environment config created (.env.camoufox)"

# Update npm scripts
echo ""
echo "Updating npm scripts for camoufox..."

# Create wrapper scripts
mkdir -p scripts

cat > scripts/test-camoufox.sh << 'EOF'
#!/bin/bash
source .env.camoufox
export USE_CAMOUFOX=true
node 1-headless-chromium-tester.js $@
EOF

cat > scripts/audit-camoufox.sh << 'EOF'
#!/bin/bash
source .env.camoufox
export USE_CAMOUFOX=true
node 2-puppeteer-stealth-scraper.js $@ audit
EOF

chmod +x scripts/*.sh
echo "✅ Wrapper scripts created in scripts/ directory"

# Verify installation
echo ""
echo "🔍 Verification:"
echo "✅ Camoufox: $(ls -l /Applications/Camoufox.app | grep -o '/.*' || echo 'not found')"
echo "✅ Default browser: $(duti -x public.url | head -1)"
echo "✅ npm modules: $(npm ls --depth=0 2>/dev/null | grep -c 'puppeteer\|camoufox' 2>/dev/null || echo '0') packages"

echo ""
echo "==========================================="
echo "✅ Setup Complete!"
echo ""
echo "Usage:"
echo "  npm run audit:anti-detection -- https://your-site.com"
echo "  USE_CAMOUFOX=true node examples.js https://your-site.com comprehensive"
echo "  scripts/audit-camoufox.sh https://your-site.com"
echo ""
echo "Camoufox features:"
echo "  🦊 Firefox-based (not Chromium)"
echo "  🕵️ Advanced stealth/anti-detection built-in"
echo "  🔒 Better privacy than Chromium"
echo "  ✅ Default browser for system"
echo ""
