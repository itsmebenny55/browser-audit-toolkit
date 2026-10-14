# Browser Audit Toolkit Skill

**Run comprehensive browser automation audits and Cloudflare bypass tests on your sites**

## Commands

### `/audit-performance URL`
Run performance, security, and SEO audit on a site.

```bash
/audit-performance https://your-site.com
```

**Output:**
- DNS/TCP/TTFB timings
- Security headers (CSP, HSTS, etc.)
- SEO metadata
- Accessibility issues

### `/audit-privacy URL`
Audit privacy and detect trackers.

```bash
/audit-privacy https://your-site.com
```

**Output:**
- Browser fingerprint (spoofed)
- Detected trackers
- Canvas/WebGL spoofing status

### `/audit-anti-detection URL`
Test bot detection on your site.

```bash
/audit-anti-detection https://your-site.com
```

**Output:**
- Detected bot protection (reCAPTCHA, hCaptcha, etc.)
- Protection mechanisms present
- Recommendations for testing

### `/bypass-cloudflare URL`
Attempt to bypass Cloudflare protection (authorized testing only).

```bash
/bypass-cloudflare https://your-site.com
```

**Output:**
- Cloudflare detection results
- Bypass attempt status
- Origin IP resolution

### `/detect-cloudflare URL`
Detect if site uses Cloudflare.

```bash
/detect-cloudflare https://your-site.com
```

**Output:**
- Cloudflare presence (yes/no)
- Challenge detected
- CF-Ray header
- Protection level

### `/audit-comprehensive URL`
Run all 5 strategies (full audit).

```bash
/audit-comprehensive https://your-site.com
```

**Output:**
- Health check
- Performance metrics
- Security audit
- Privacy audit
- Bot detection test

### `/toolkit-verify`
Verify toolkit integrity and startup.

```bash
/toolkit-verify
```

**Output:**
- Project structure status
- All modules loaded
- Dependencies verified
- System setup checked

### `/toolkit-restore`
Restore toolkit after Claude Code update.

```bash
/toolkit-restore
```

**Output:**
- Dependencies reinstalled
- Files verified
- Startup completed

## Usage Examples

```bash
# Quick performance check
/audit-performance https://your-site.com

# Privacy compliance check
/audit-privacy https://your-site.com

# Test your bot detection
/audit-anti-detection https://your-site.com

# Check Cloudflare protection
/detect-cloudflare https://your-site.com

# Attempt bypass (authorized only)
/bypass-cloudflare https://your-site.com

# Full comprehensive audit
/audit-comprehensive https://your-site.com

# Verify toolkit is healthy
/toolkit-verify
```

## Features

✅ **5 Automation Strategies**
- Headless Chromium testing
- Puppeteer stealth scraping
- Privacy verification
- Anti-detection testing
- Cloudflare bypass

✅ **Comprehensive Audits**
- Performance metrics (DNS, TTFB, load time)
- Security headers (CSP, HSTS, X-Frame-Options)
- SEO verification (title, meta, structured data)
- Accessibility checks
- Tracker detection
- Bot protection testing

✅ **Anti-Detection**
- Navigator.webdriver hidden
- Browser fingerprint spoofing
- Canvas/WebGL randomization
- Realistic headers
- Human-like behavior

✅ **Cloudflare Support**
- Auto-detection
- Challenge token extraction
- Direct IP bypass (when available)
- Challenge solving

## Authorization

**This skill is for authorized testing only:**
- ✅ Auditing your own sites
- ✅ Pentesting with written permission
- ✅ Security research on your infrastructure
- ✅ Privacy compliance verification

**Not for:**
- ❌ Unauthorized third-party access
- ❌ Malicious purposes

## Setup

Toolkit auto-starts when you open the project in Claude Code.

Commands are ready to use immediately:
```bash
/audit-performance https://your-site.com
```

## Documentation

- **README.md** — Complete feature guide
- **QUICK-START.md** — Get running in 2 minutes
- **TOOLKIT-COMPLETE.md** — All strategies explained
- **CLAUDE-CODE-AUTOSTART.md** — Auto-startup guide
- **CLOUDFLARE-INTEGRATION.md** — Bypass guide

## Troubleshooting

**Command not found?**
- Verify toolkit is loaded: `/toolkit-verify`
- Check if npm packages installed
- Run restore: `/toolkit-restore`

**Need to bypass Cloudflare?**
- You need Cloudflare API credentials or known origin IP
- See CLOUDFLARE-INTEGRATION.md for details

**Toolkit state is weird?**
- Run verification: `/toolkit-verify`
- Full restore: `/toolkit-restore`

## More Information

**Repository:** https://github.com/itsmebenny55/browser-audit-toolkit

**Quick commands:**
```bash
npm run audit:performance -- URL
npm run audit:anti-detection -- URL
npm run bypass:cloudflare -- URL
node examples.js URL comprehensive
```
