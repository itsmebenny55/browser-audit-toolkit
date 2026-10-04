#!/usr/bin/env node
/**
 * 2. Puppeteer Stealth Scraper — Advanced automation with anti-detection
 * Use for: comprehensive scraping, behavioral testing, bot-detection auditing
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Try to use camoufox if available, otherwise use puppeteer-extra with stealth
const useCamoufox = process.env.USE_CAMOUFOX !== 'false';

puppeteer.use(StealthPlugin());

class PuppeteerStealthScraper {
  constructor(options = {}) {
    this.headless = options.headless !== false;
    this.devtools = options.devtools || false;
    this.slowMo = options.slowMo || 0;
    this.timeout = options.timeout || 30000;
    this.userAgent = options.userAgent || null;
    this.viewport = options.viewport || { width: 1920, height: 1080 };
    this.proxy = options.proxy || null;
    this.cookies = options.cookies || [];
    this.browser = null;
    this.page = null;
  }

  async launch() {
    const args = [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--single-process=false',
      '--disable-background-networking',
      '--disable-client-side-phishing-detection',
      '--disable-component-extensions-with-background-pages',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-features=InterestFeedContentSuggestions,Translate',
      '--disable-sync',
      '--metrics-recording-only',
      '--no-default-browser-check',
      '--no-first-run',
      '--password-store=basic',
      '--use-mock-keychain',
    ];

    if (this.proxy) {
      args.push(`--proxy-server=${this.proxy}`);
    }

    let launchConfig = {
      headless: this.headless ? 'new' : false,
      devtools: this.devtools,
      slowMo: this.slowMo,
      args,
      defaultViewport: this.viewport,
    };

    // Try camoufox first if enabled
    if (useCamoufox) {
      const camoufoxPath = process.env.CAMOUFOX_PATH ||
        '/Applications/Camoufox.app/Contents/MacOS/firefox';

      try {
        const fs = require('fs');
        if (fs.existsSync(camoufoxPath)) {
          launchConfig.executablePath = camoufoxPath;
          console.log('🦊 Using camoufox (Firefox-based stealth)');
        }
      } catch (e) {
        console.warn('⚠️ Camoufox not found, falling back to Chromium');
      }
    }

    this.browser = await puppeteer.launch(launchConfig);

    this.page = await this.browser.newPage();

    // Anti-detection: spoof navigator properties
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
      window.chrome = { runtime: {} };
    });

    if (this.userAgent) {
      await this.page.setUserAgent(this.userAgent);
    }

    // Add cookies
    if (this.cookies.length > 0) {
      await this.page.setCookie(...this.cookies);
    }

    // Randomize viewport for fingerprint variation
    const randomViewport = {
      width: 1920 + Math.random() * 100,
      height: 1080 + Math.random() * 100,
      deviceScaleFactor: Math.random() > 0.5 ? 1 : 2,
    };
    await this.page.setViewport(randomViewport);
  }

  async scrape(url, extractor) {
    if (!this.page) await this.launch();

    try {
      // Random delay before navigation (human-like)
      await new Promise(r => setTimeout(r, Math.random() * 3000 + 1000));

      await this.page.goto(url, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: this.timeout,
      });

      // Random delay before extraction
      await new Promise(r => setTimeout(r, Math.random() * 2000 + 500));

      const result = await this.page.evaluate(extractor);

      return {
        success: true,
        url,
        timestamp: new Date().toISOString(),
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        url,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async audit(url, options = {}) {
    if (!this.page) await this.launch();

    await this.page.goto(url, { waitUntil: 'networkidle0' });

    const audit = {
      url,
      timestamp: new Date().toISOString(),
      performance: {},
      security: {},
      seo: {},
      accessibility: {},
    };

    // Performance metrics
    const metrics = await this.page.metrics();
    audit.performance.metrics = metrics;

    // Page load timing
    const timing = await this.page.evaluate(() => {
      const t = performance.timing;
      return {
        dns: t.domainLookupEnd - t.domainLookupStart,
        tcp: t.connectEnd - t.connectStart,
        ttfb: t.responseStart - t.requestStart,
        download: t.responseEnd - t.responseStart,
        domInteractive: t.domInteractive - t.navigationStart,
        domComplete: t.domComplete - t.navigationStart,
        loadComplete: t.loadEventEnd - t.navigationStart,
      };
    });
    audit.performance.timing = timing;

    // Security headers
    const response = await this.page.goto(url);
    const headers = await response.headers();
    audit.security.headers = {
      csp: headers['content-security-policy'],
      xframe: headers['x-frame-options'],
      xss: headers['x-xss-protection'],
      referrer: headers['referrer-policy'],
      hsts: headers['strict-transport-security'],
    };

    // SEO checks
    audit.seo = await this.page.evaluate(() => {
      const doc = document;
      return {
        title: doc.title,
        metaDescription: doc.querySelector('meta[name="description"]')?.content,
        h1Count: doc.querySelectorAll('h1').length,
        canonicalUrl: doc.querySelector('link[rel="canonical"]')?.href,
        ogTags: Array.from(doc.querySelectorAll('meta[property^="og:"]')).map(m => ({
          property: m.getAttribute('property'),
          content: m.getAttribute('content'),
        })),
        structuredData: Array.from(doc.querySelectorAll('script[type="application/ld+json"]')).map(s =>
          JSON.parse(s.textContent)
        ),
      };
    });

    // Accessibility checks
    audit.accessibility = await this.page.evaluate(() => {
      return {
        imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
        linksWithoutText: document.querySelectorAll('a:not(:has(*)):empty').length,
        formsWithoutLabels: document.querySelectorAll('input:not([aria-label]):not([id])').length,
        contrastIssues: document.querySelectorAll('[role="main"] *').length, // placeholder
      };
    });

    return audit;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = PuppeteerStealthScraper;

// CLI usage
if (require.main === module) {
  const url = process.argv[2] || 'https://example.com';
  const mode = process.argv[3] || 'audit';

  (async () => {
    const scraper = new PuppeteerStealthScraper({
      headless: true,
      slowMo: 100,
    });

    try {
      let result;
      if (mode === 'audit') {
        result = await scraper.audit(url);
      } else {
        result = await scraper.scrape(url, () => ({
          title: document.title,
          headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent),
          links: Array.from(document.querySelectorAll('a')).map(a => a.href),
        }));
      }

      console.log(JSON.stringify(result, null, 2));
    } finally {
      await scraper.close();
    }
  })();
}
