# Quick Start Guide

## Setup (2 minutes)

```bash
cd /Volumes/My\ Shared\ Files/Projects/browser-audit-toolkit
npm install
```

## Choose Your Strategy

### I need a fast regression test
```bash
npm run test:headless -- https://your-site.com
```
**→ 1. Headless Chromium Tester** (2-5s, lightweight)

### I need performance & security metrics
```bash
npm run audit:performance -- https://your-site.com
```
**→ 2. Puppeteer Stealth Scraper** (5-15s, comprehensive)

### I need privacy verification
```bash
npm run audit:privacy -- https://your-site.com
npm run audit:trackers -- https://your-site.com
```
**→ 3. Privacy-Hardened Browser** (10-20s, fingerprint + trackers)

### I need to test my bot detection
```bash
npm run audit:anti-detection -- https://your-site.com
```
**→ 4. Advanced Anti-Detection** (15-30s, behavioral mimicry)

### I want everything
```bash
npm run test:all -- https://your-site.com
```

## Real-World Examples

```bash
# Run practical examples
node examples.js https://your-site.com health          # Daily check
node examples.js https://your-site.com performance     # Perf + Security
node examples.js https://your-site.com privacy         # Privacy audit
node examples.js https://your-site.com botdetection    # Bot detection
node examples.js https://your-site.com scrape          # Custom scrape
node examples.js https://your-site.com comprehensive   # Everything
```

## API Usage (Node.js)

```javascript
const { PuppeteerStealthScraper } = require('./index');

const scraper = new PuppeteerStealthScraper();
await scraper.launch();

// Full audit
const audit = await scraper.audit('https://your-site.com');
console.log(audit.performance.timing);  // DNS, TTFB, load time
console.log(audit.security.headers);    // CSP, HSTS, X-Frame-Options
console.log(audit.seo);                  // Title, meta, structured data
console.log(audit.accessibility);        // Missing alt text, labels

await scraper.close();
```

## Four Strategies Comparison

| Feature | 1. Headless | 2. Stealth | 3. Privacy | 4. Anti-Det |
|---------|-----------|-----------|-----------|------------|
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡ | ⚡ |
| Detection Evasion | ❌ | ✅ | ✅✅ | ✅✅✅ |
| Performance Metrics | ✅ | ✅✅ | ✅ | ✅ |
| Security Headers | ❌ | ✅✅ | ✅ | ✅ |
| Fingerprint Audit | ❌ | ❌ | ✅✅ | ✅ |
| Tracker Detection | ❌ | ❌ | ✅✅ | ❌ |
| Bot Detection Test | ❌ | ✅ | ❌ | ✅✅✅ |
| Custom Scraping | ✅ | ✅✅ | ✅ | ✅ |
| Human Behavior | ❌ | ✅ | ✅ | ✅✅✅ |

## Output Examples

### Performance Timing
```json
{
  "dns": 45,
  "tcp": 120,
  "ttfb": 250,
  "download": 180,
  "domComplete": 1200,
  "loadComplete": 1850
}
```

### Security Headers
```json
{
  "csp": "default-src 'self'",
  "xframe": "DENY",
  "hsts": "max-age=31536000",
  "xss": "1; mode=block",
  "referrer": "strict-origin-when-cross-origin"
}
```

### Bot Detection Results
```json
{
  "detectedVectors": ["recaptcha"],
  "vulnerabilities": ["HTTP-403"],
  "recommendations": [
    "Site uses reCAPTCHA - may require human intervention",
    "Rate limiting detected - implement request spacing"
  ]
}
```

### Privacy Fingerprint
```json
{
  "navigator": {
    "userAgent": "Mozilla/5.0...",
    "platform": "Linux x86_64",
    "webdriver": false
  },
  "screen": {
    "width": 1920,
    "height": 1080,
    "colorDepth": 24
  }
}
```

## Tips & Tricks

### Headless only (faster)
```bash
HEADLESS=true npm run test:headless -- https://your-site.com
```

### See the browser window
```bash
HEADLESS=false npm run audit:anti-detection -- https://your-site.com
```

### Enable debug logging
```bash
DEBUG=* node examples.js https://your-site.com comprehensive
```

### Custom scripts (node API)
```javascript
const { AdvancedAntiDetection } = require('./index');

const detector = new AdvancedAntiDetection();
await detector.launch();

// Human-like scrolling
await detector.scroll(null, 5);

// Human-like clicking
await detector.click('button.submit');

// Human-like typing
await detector.type('input.search', 'my query', { delay: 75 });

await detector.close();
```

## Troubleshooting

**Error: "Chromium not found"**
```bash
npm install --no-save puppeteer@latest
```

**Error: "Connection timeout"**
- Add more delay: `{ slowMo: 200 }`
- Increase timeout: `{ timeout: 60000 }`

**Out of memory**
- Close browser between runs
- Process one URL at a time
- Use Headless Chromium instead of Puppeteer

**Still being detected as bot**
- Switch to `AdvancedAntiDetection` strategy
- Add custom delays: `{ slowMo: 150 }`
- Try multiple times (randomization helps)

## Next Steps

1. **Read full docs:** `cat README.md`
2. **See all examples:** `node examples.js --help`
3. **Integrate into CI/CD:** See `.github/workflows/audit.yml`
4. **Monitor over time:** Store results and track regressions

## Use Cases

- ✅ Site health monitoring
- ✅ Performance regression testing
- ✅ Security header compliance
- ✅ Privacy verification (GDPR, CCPA)
- ✅ Tracker detection
- ✅ Bot detection system testing
- ✅ Accessibility audits
- ✅ SEO verification

---

**Remember:** Only test sites you own or have explicit permission to test.
