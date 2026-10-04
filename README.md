# Browser Audit Toolkit

State-of-the-art browser automation for testing, scraping, and privacy auditing of your own sites.

**Use cases:** Site auditing, compliance testing, bot detection testing, performance monitoring, privacy verification, tracker detection.

## Installation

```bash
cd /Volumes/My\ Shared\ Files/Projects/browser-audit-toolkit
npm install
```

Requires Node 18+. Chromium will be installed automatically with Puppeteer.

## Four Strategies

### 1. Headless Chromium Tester

**Best for:** Fast regression testing, CI/CD pipelines, basic performance checks.

**Features:**
- Lightweight, minimal overhead
- Fast execution
- Built-in performance metrics
- SEO checks (title, meta tags, h1 count)

**Usage:**

```bash
node 1-headless-chromium-tester.js https://your-site.com
```

**API:**

```javascript
const HeadlessChromiumTester = require('./1-headless-chromium-tester');

const tester = new HeadlessChromiumTester({
  viewport: { width: 1920, height: 1080 },
  timeout: 30000,
});

const result = await tester.testPage('https://your-site.com', {
  hasMetaViewport: `doc.querySelector('meta[name="viewport"]') !== null`,
  hasCSP: `doc.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null`,
});
```

---

### 2. Puppeteer Stealth Scraper

**Best for:** Comprehensive automation, behavioral testing, avoiding detection.

**Features:**
- Anti-detection spoofing (hides automation indicators)
- Performance auditing (timing, metrics)
- Security header analysis
- SEO/metadata extraction
- Accessibility checks
- Resource blocking for speed

**Usage:**

```bash
# Scrape page content
node 2-puppeteer-stealth-scraper.js https://your-site.com scrape

# Full performance audit
node 2-puppeteer-stealth-scraper.js https://your-site.com audit
```

**API:**

```javascript
const PuppeteerStealth = require('./2-puppeteer-stealth-scraper');

const scraper = new PuppeteerStealth({
  headless: true,
  slowMo: 100, // Slow down to appear human
  userAgent: 'Mozilla/5.0 (Custom User Agent)',
});

await scraper.launch();

// Custom scraping
const result = await scraper.scrape('https://your-site.com', () => ({
  title: document.title,
  headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent),
  links: Array.from(document.querySelectorAll('a')).map(a => a.href),
}));

// Full audit (performance, security, SEO, accessibility)
const audit = await scraper.audit('https://your-site.com');

await scraper.close();
```

**Output includes:**
- DNS/TCP/TTFB timings
- Security headers (CSP, X-Frame-Options, HSTS, etc.)
- SEO metadata (title, description, structured data)
- Accessibility issues (missing alt text, labels, etc.)

---

### 3. Privacy-Hardened Browser

**Best for:** Privacy auditing, anonymized testing, tracker detection.

**Features:**
- Complete fingerprint spoofing (navigator, screen, WebGL, canvas)
- Timezone/language randomization
- WebRTC leak prevention
- Tracking API blocking
- Cross-site tracker detection
- Canvas fingerprinting resistance

**Usage:**

```bash
# Audit fingerprint (what the site sees about your browser)
node 3-privacy-hardened-browser.js https://your-site.com fingerprint

# Detect tracking scripts
node 3-privacy-hardened-browser.js https://your-site.com trackers
```

**API:**

```javascript
const PrivacyBrowser = require('./3-privacy-hardened-browser');

const browser = new PrivacyBrowser({
  proxy: 'http://proxy.example.com:8080', // Optional
});

await browser.launch();

// What the site can see about your browser
const fingerprint = await browser.auditFingerprint('https://your-site.com');

// What trackers are being loaded
const trackers = await browser.detectTrackers('https://your-site.com');

await browser.close();
```

**Spoofing includes:**
- Random user agent, platform, languages
- Random screen resolution & pixel depth
- Random hardware concurrency & device memory
- Fake WebGL vendor/renderer
- Canvas fingerprinting resistance
- Timezone spoofing
- WebRTC blocking

---

### 4. Advanced Anti-Detection Suite

**Best for:** Testing bot detection systems, behavioral analysis, compliance audits.

**Features:**
- Behavioral profile mimicry (casual user, power user, mobile, slow connection)
- Human-like mouse movements and timing
- Network condition emulation
- CDP (Chrome DevTools Protocol) detection bypass
- Request header manipulation
- Bot detection library detection (reCAPTCHA, hCaptcha, Cloudflare, Imperva, etc.)
- Recommendations based on detected protection

**Usage:**

```bash
node 4-advanced-anti-detection.js https://your-site.com
```

**API:**

```javascript
const AdvancedAntiDetection = require('./4-advanced-anti-detection');

const detector = new AdvancedAntiDetection({});

await detector.launch();

// Test what bot detection mechanisms are present
const audit = await detector.auditBotDetection('https://your-site.com');

// Human-like interactions
await detector.scroll(null, 5); // Scroll 5 times
await detector.click('button.submit'); // Click with human movement
await detector.type('input.search', 'my search query', { delay: 75 });

// Detect specific protection mechanisms
const detection = await detector.detectProtection('https://your-site.com');

await detector.close();
```

**Bot detection libraries detected:**
- reCAPTCHA / hCaptcha
- Cloudflare Bot Management
- Imperva / Distil Networks
- Akamai RUM
- DataDome
- PerimeterX
- CDP-based detection
- Rate limiting (HTTP 429)
- Browser automation indicators

---

## Quick Start Examples

### Site Health Check

```bash
npm run test:headless -- https://your-site.com
```

### Complete Privacy Audit

```bash
npm run audit:privacy -- https://your-site.com
npm run audit:trackers -- https://your-site.com
```

### Bot Detection Testing

```bash
npm run audit:anti-detection -- https://your-site.com
```

### Performance & Security Audit

```bash
npm run audit:performance -- https://your-site.com
```

## Advanced Usage

### Custom Scraper with Human-Like Behavior

```javascript
const Scraper = require('./2-puppeteer-stealth-scraper');

const scraper = new Scraper({
  headless: true,
  slowMo: 150, // Add 150ms delay between actions
});

await scraper.launch();

const data = await scraper.scrape('https://api.example.com/data', () => {
  // Your custom extraction logic
  return {
    timestamp: new Date().toISOString(),
    data: document.body.textContent,
  };
});

await scraper.close();
```

### Auditing Your Own Bot Detection

```javascript
const Detector = require('./4-advanced-anti-detection');

const detector = new Detector();
await detector.launch();

const result = await detector.auditBotDetection('https://your-site.com');

console.log('Detected Protection Mechanisms:', result.detectionVectors.detectedVectors);
console.log('Vulnerabilities Found:', result.detectionVectors.vulnerabilities);
console.log('Recommendations:', result.recommendations);

await detector.close();
```

### Combining Multiple Strategies

```javascript
const Headless = require('./1-headless-chromium-tester');
const Stealth = require('./2-puppeteer-stealth-scraper');
const Privacy = require('./3-privacy-hardened-browser');

async function comprehensiveAudit(url) {
  // Fast regression test
  const headlessResult = await new Headless().testPage(url);
  
  // Deep performance audit
  const stealthScraper = new Stealth();
  const performanceAudit = await stealthScraper.audit(url);
  
  // Privacy check
  const privacyBrowser = new Privacy();
  const fingerprint = await privacyBrowser.auditFingerprint(url);
  const trackers = await privacyBrowser.detectTrackers(url);
  
  return {
    basic: headlessResult,
    performance: performanceAudit,
    privacy: { fingerprint, trackers },
  };
}
```

## Configuration

### Environment Variables

```bash
# Enable verbose logging
DEBUG=* node 2-puppeteer-stealth-scraper.js https://your-site.com

# Set proxy
PROXY=http://proxy:8080 node 3-privacy-hardened-browser.js https://your-site.com

# Disable headless (see browser window)
HEADLESS=false node 1-headless-chromium-tester.js https://your-site.com
```

## Performance Notes

- **Headless Chromium Tester:** ~2-5s per page
- **Puppeteer Stealth:** ~5-15s per page (includes full audit)
- **Privacy Browser:** ~10-20s per page
- **Anti-Detection:** ~15-30s per page (with behavioral delays)

## Troubleshooting

### Chromium won't launch
```bash
npm install --no-save puppeteer@latest
```

### Out of memory on large datasets
Process pages serially and close browser between runs:
```javascript
for (const url of urls) {
  const scraper = new Scraper();
  await scraper.launch();
  const result = await scraper.scrape(url, fn);
  await scraper.close();
}
```

### Detection still showing as present
- Add custom `slowMo` delay: `new Scraper({ slowMo: 200 })`
- Use `AdvancedAntiDetection` instead of basic stealth
- Check CDM (Chrome Device Emulation) vs CDP (Chrome DevTools Protocol)

## Best Practices

1. **Always test on your own sites only** — never target third-party sites without authorization
2. **Respect rate limits** — add delays between requests
3. **Use appropriate browser class for the task** — don't use Advanced Anti-Detection for simple scraping
4. **Run in CI/CD** — integrate into your testing pipeline
5. **Monitor changes** — use this as a baseline for regression detection

## Legal & Ethical Use

This toolkit is designed for:
- ✅ Auditing **your own** websites
- ✅ Testing **your own** bot detection systems
- ✅ Privacy compliance verification (GDPR, CCPA)
- ✅ Performance monitoring
- ✅ Security research on your infrastructure

**Do not use for:**
- ❌ Scraping third-party sites without permission
- ❌ Evading security on systems you don't own
- ❌ Bypassing authentication or access controls
- ❌ Any malicious purpose

## License

MIT
