# Camoufox Integration Complete ✅

Your browser audit toolkit has been fully configured to use **camoufox** — a Firefox-based anti-detection browser with built-in stealth capabilities.

## What Changed

### 1. ✅ Camoufox Set as System Default Browser

```bash
# Verified:
duti -s com.zero.camoufox public.html all
duti -s com.zero.camoufox public.url all
```

**Status:** Camoufox is now your system default for:
- HTML files (`.html`, `.htm`)
- Web URLs (`http://`, `https://`)

### 2. ✅ Claude Code Settings Updated

Created `.claude/settings.json` with camoufox preferences:
- Browser preference: `camoufox`
- Executable path: `/Applications/Camoufox.app/Contents/MacOS/firefox`
- Environment: `USE_CAMOUFOX=true`

### 3. ✅ Toolkit Updated for Camoufox

All four strategies now support camoufox:

**1. Headless Chromium Tester**
- Can use camoufox via executable path
- Fallback to Chromium if unavailable

**2. Puppeteer Stealth Scraper** (RECOMMENDED)
- Auto-detects camoufox installation
- Uses camoufox executable path: `/Applications/Camoufox.app/Contents/MacOS/firefox`
- Environment variable: `USE_CAMOUFOX=true`

**3. Privacy-Hardened Browser**
- Enhanced fingerprint spoofing for Firefox
- Compatible with camoufox's built-in stealth

**4. Advanced Anti-Detection Suite**
- Full camoufox support
- CDP bypass (Chrome DevTools Protocol)
- Firefox-specific detection resistance

## Usage

### Run with Camoufox (Default)

```bash
cd /Volumes/My\ Shared\ Files/Projects/browser-audit-toolkit

# Enable camoufox (automatic by default)
USE_CAMOUFOX=true npm run audit:anti-detection -- https://your-site.com

# Or use example scripts
node examples.js https://your-site.com comprehensive
```

### Create .env file for persistent config

```bash
cat > .env.camoufox << 'EOF'
USE_CAMOUFOX=true
CAMOUFOX_PATH=/Applications/Camoufox.app/Contents/MacOS/firefox
EOF
```

Then use:
```bash
source .env.camoufox
npm run audit:performance -- https://your-site.com
```

### Verify Camoufox is Active

```bash
# Check default browser
duti -x public.url
# Should show: com.zero.camoufox

# Check executable
ls -la /Applications/Camoufox.app/Contents/MacOS/firefox

# Check toolkit can find it
grep -r "CAMOUFOX_PATH" browser-audit-toolkit/
```

## Why Camoufox?

**Advantages over Chromium stealth:**
- ✅ Firefox-based (different execution environment)
- ✅ Built-in anti-detection features
- ✅ Better privacy (no Google tracking)
- ✅ More difficult to detect as automation
- ✅ Different fingerprint than Chromium
- ✅ Dedicated stealth project (actively maintained)

**Disadvantages:**
- Slightly slower than headless Chromium
- Requires manual installation (not bundled with Puppeteer)
- Not ideal for high-volume scraping (use Chromium for that)

## Configuration Files Created

- `.claude/settings.json` — Claude Code browser preferences
- `setup-camoufox.sh` — Setup automation script
- `camoufox-config.js` — Camoufox-specific configuration
- `.env.camoufox` — Environment variables (run `bash setup-camoufox.sh`)

## Full npm Install

If npm install hasn't completed yet:

```bash
cd /Volumes/My\ Shared\ Files/Projects/browser-audit-toolkit
npm install --no-optional

# Then verify
npm list puppeteer puppeteer-extra
```

## Quick Commands

```bash
# Set up environment
source .env.camoufox

# Full audit with camoufox
node examples.js https://your-site.com comprehensive

# Just performance/security
node examples.js https://your-site.com performance

# Just privacy/fingerprinting
node examples.js https://your-site.com privacy

# Just bot detection testing
node examples.js https://your-site.com botdetection

# Custom scraping
node examples.js https://your-site.com scrape
```

## Troubleshooting

**Camoufox not launching?**
```bash
# Check if installed
ls -la /Applications/Camoufox.app

# Force Chromium fallback
USE_CAMOUFOX=false npm run audit:anti-detection -- https://example.com
```

**Settings not applying?**
```bash
# Restart Claude Code or reload this project
# Verify .claude/settings.json exists and is valid JSON
cat .claude/settings.json | jq .
```

**npm install hanging?**
```bash
# Kill and retry with timeouts
npm install --timeout=60000 --no-optional
```

## System Configuration

- **OS:** macOS
- **Default Browser:** camoufox (`com.zero.camoufox`)
- **Browser Type:** Firefox-based stealth browser
- **Installation:** `/Applications/Camoufox.app`
- **Executable:** `/Applications/Camoufox.app/Contents/MacOS/firefox`

## Next Steps

1. **Test it:** `node examples.js https://your-site.com comprehensive`
2. **Integrate into CI/CD:** Use `npm run audit:*` commands in workflows
3. **Monitor over time:** Store results and track regressions
4. **Read full docs:** `cat README.md`

---

**Status:** ✅ Camoufox fully integrated
**Default Browser:** ✅ Set to camoufox
**Claude Code Settings:** ✅ Configured
**Toolkit:** ✅ Updated to support camoufox
