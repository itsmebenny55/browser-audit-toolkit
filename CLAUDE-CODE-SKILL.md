# Browser Audit Toolkit - Claude Code Skill

**Type `/` in Claude Code to access browser audit commands**

## 🎯 Quick Usage

Just type `/` followed by a command:

```
/audit-performance https://your-site.com
/audit-privacy https://your-site.com
/audit-anti-detection https://your-site.com
/bypass-cloudflare https://your-site.com
/toolkit-verify
```

## 📋 Available Commands

### Audit Commands

#### `/audit-performance URL`
**Run performance, security, and SEO audit**

```
/audit-performance https://your-site.com
```

Output:
- DNS, TCP, TTFB timings
- Security headers (CSP, HSTS, etc.)
- SEO metadata
- Accessibility issues

---

#### `/audit-privacy URL`
**Audit privacy and detect trackers**

```
/audit-privacy https://your-site.com
```

Output:
- Browser fingerprint verification
- Detected trackers (Google Analytics, Facebook, etc.)
- Privacy indicators

---

#### `/audit-anti-detection URL`
**Test your bot detection systems**

```
/audit-anti-detection https://your-site.com
```

Output:
- Detected bot protection (reCAPTCHA, hCaptcha, etc.)
- Bot detection mechanisms
- Recommendations for testing

---

#### `/bypass-cloudflare URL`
**Attempt Cloudflare bypass (authorized testing)**

```
/bypass-cloudflare https://your-site.com
```

Output:
- Cloudflare challenge detection
- Bypass attempt status
- Origin IP resolution

⚠️ **Authorized testing only** - For sites you own or have permission to test

---

#### `/detect-cloudflare URL`
**Detect Cloudflare protection**

```
/detect-cloudflare https://your-site.com
```

Output:
- Cloudflare present (yes/no)
- Challenge detected
- CF-Ray header
- Protection level

---

#### `/audit-comprehensive URL`
**Run all 5 strategies for complete audit**

```
/audit-comprehensive https://your-site.com
```

Output:
- Health check
- Performance metrics
- Security audit
- Privacy audit
- Bot detection test

---

### Toolkit Commands

#### `/toolkit-verify`
**Verify toolkit integrity and startup**

```
/toolkit-verify
```

Checks:
- All modules loaded
- Dependencies installed
- Configuration files present

---

#### `/toolkit-restore`
**Restore toolkit after Claude Code update**

```
/toolkit-restore
```

Does:
- Reinstalls dependencies
- Verifies files
- Runs full startup

---

## 💡 Usage Examples

### Website Owner Auditing Their Site

```
# Quick performance check
/audit-performance https://mysite.com

# Check for trackers
/audit-privacy https://mysite.com

# Test bot detection
/audit-anti-detection https://mysite.com

# Full comprehensive audit
/audit-comprehensive https://mysite.com
```

### Security Testing (Authorized)

```
# Check if Cloudflare is protecting
/detect-cloudflare https://mysite.com

# Attempt authorized bypass
/bypass-cloudflare https://mysite.com
```

### Maintenance

```
# Check toolkit health
/toolkit-verify

# After Claude Code update
/toolkit-restore
```

## 🔧 What Each Strategy Does

### 1. Headless Chromium Tester
Fast, lightweight regression testing for CI/CD

### 2. Puppeteer Stealth Scraper ⭐ Most Used
Comprehensive performance audit with:
- Performance metrics (DNS, TTFB, load times)
- Security headers analysis
- SEO verification
- Accessibility checks

### 3. Privacy-Hardened Browser
Privacy verification with:
- Fingerprint spoofing detection
- Tracker detection (20+ services)
- Canvas/WebGL spoofing verification

### 4. Advanced Anti-Detection
Bot detection testing with:
- reCAPTCHA detection
- hCaptcha detection
- Cloudflare bot protection detection
- Human-like behavior mimicry

### 5. Cloudflare Bypass ⭐ NEW
Cloudflare protection handling with:
- Automatic detection
- Challenge token extraction
- Direct IP bypass (when available)

## 🚀 Auto-Startup

The toolkit **starts automatically** when you open the project:

```
Opening project in Claude Code
        ↓
Detects .claude/settings.json
        ↓
Runs startup.sh
        ↓
✅ Toolkit Ready
        ↓
Type / to use commands
```

## ✨ Smart Features

### Auto-Detection
```
/detect-cloudflare https://mysite.com
→ Automatically detects if Cloudflare is protecting
→ Shows protection level
→ Provides bypass recommendations
```

### Performance Metrics
```
/audit-performance https://mysite.com
→ DNS lookup time
→ TCP connection time
→ Time to first byte (TTFB)
→ DOM complete time
→ Full page load time
```

### Security Analysis
```
/audit-performance https://mysite.com
→ CSP (Content Security Policy)
→ HSTS (HTTP Strict Transport Security)
→ X-Frame-Options
→ X-XSS-Protection
→ Referrer-Policy
```

### Tracker Detection
```
/audit-privacy https://mysite.com
→ Google Analytics
→ Facebook Pixel
→ Mixpanel
→ Amplitude
→ And 16+ more trackers
```

## 🔐 Authorization

### ✅ You Can Use For:
- Auditing your own sites
- Authorized security testing
- Privacy compliance checks
- Performance monitoring
- Bot detection testing

### ❌ Not For:
- Unauthorized third-party sites
- Malicious purposes
- Evading security measures you don't own

## 🎓 Learning

Each command output includes:
- **What was found** (specific metrics, headers, trackers)
- **What it means** (why this matters)
- **What to do about it** (recommendations)

## 📊 Output Example

```
📊 Performance Audit: https://example.com

Status: 200
✅ Page loaded successfully

Performance Metrics:
  DNS:           45ms
  TCP:          120ms
  TTFB:         250ms
  DOM:         1200ms
  Load:        1850ms

Security Headers:
  ✅ Content-Security-Policy
  ✅ Strict-Transport-Security
  ✅ X-Frame-Options: DENY
  ❌ X-Content-Type-Options: missing

SEO:
  Title: Example Domain
  Meta Description: ✅ Present
  H1 Count: 1
  Canonical URL: ✅ Present
```

## 🆘 Troubleshooting

### Command Not Found?
```
/toolkit-verify
```
This checks if toolkit is properly loaded.

### Need Full Restore?
```
/toolkit-restore
```
This will reinstall everything and run full startup.

### Help With Specific Command?
```
/audit-comprehensive https://your-site.com
```
Run this for a complete audit with detailed output.

## 📚 More Information

- **README.md** — Complete feature guide
- **QUICK-START.md** — Quick reference
- **TOOLKIT-COMPLETE.md** — All strategies
- **CLOUDFLARE-INTEGRATION.md** — Bypass guide
- **CLAUDE-CODE-AUTOSTART.md** — Auto-startup guide

## 🔗 Repository

**https://github.com/itsmebenny55/browser-audit-toolkit**

## 💻 Direct npm Commands

When not using the skill, you can run directly:

```bash
npm run audit:performance -- https://your-site.com
npm run audit:anti-detection -- https://your-site.com
npm run bypass:cloudflare -- https://your-site.com
node examples.js https://your-site.com comprehensive
```

---

## Quick Command Reference

| Command | Use | Takes |
|---------|-----|-------|
| `/audit-performance` | Full site audit | URL |
| `/audit-privacy` | Privacy check | URL |
| `/audit-anti-detection` | Bot detection test | URL |
| `/bypass-cloudflare` | CF bypass attempt | URL |
| `/detect-cloudflare` | Check if CF present | URL |
| `/audit-comprehensive` | All 5 strategies | URL |
| `/toolkit-verify` | Health check | — |
| `/toolkit-restore` | Full restore | — |

---

**Status:** ✅ **SKILL READY**  
**Usage:** Type `/` in Claude Code  
**Auto-Starts:** When project opens

