#!/usr/bin/env node
/**
 * 4. Advanced Anti-Detection Suite — Behavioral mimicry & sophisticated spoofing
 * Use for: bot-detection testing, behavioral analysis, compliance auditing
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

class AdvancedAntiDetection {
  constructor(options = {}) {
    this.profile = this.generateBehaviorProfile();
    this.browser = null;
    this.page = null;
    this.detectionLog = [];
  }

  generateBehaviorProfile() {
    const profiles = [
      { name: 'casual_user', randomDelay: [500, 3000], scrollPause: [1000, 5000], clickAccuracy: 0.95 },
      { name: 'power_user', randomDelay: [100, 800], scrollPause: [200, 1500], clickAccuracy: 0.99 },
      { name: 'mobile_user', randomDelay: [1000, 4000], scrollPause: [2000, 7000], clickAccuracy: 0.85 },
      { name: 'slow_connection', randomDelay: [2000, 6000], scrollPause: [3000, 10000], clickAccuracy: 0.90 },
    ];

    return profiles[Math.floor(Math.random() * profiles.length)];
  }

  randomDelay() {
    const [min, max] = this.profile.randomDelay;
    return Math.random() * (max - min) + min;
  }

  async launch() {
    const args = [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-web-resources',
      '--disable-component-update',
      '--disable-sync',
      '--disable-extensions',
      '--start-maximized',
    ];

    this.browser = await puppeteer.launch({
      headless: 'new',
      args,
      defaultViewport: null,
    });

    this.page = await this.browser.newPage();
    await this.applyAdvancedSpoofing();
  }

  async applyAdvancedSpoofing() {
    // CDP (Chrome DevTools Protocol) based detection bypass
    const client = await this.page.target().createCDPSession();

    // Emulate network conditions
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 500 * 1024 / 8, // 500 kbps
      uploadThroughput: 200 * 1024 / 8,   // 200 kbps
      latency: Math.random() * 50 + 20,   // 20-70ms
    });

    // Spoof device characteristics
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
      hasTouch: false,
    });

    // Spoof timezone
    await client.send('Emulation.setTimezoneOverride', {
      timezoneId: 'America/New_York',
    });

    // Block Chrome-specific detection vectors
    await this.page.evaluateOnNewDocument(() => {
      // Remove webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });

      // Spoof plugins
      const plugin = {
        name: 'Chrome PDF Plugin',
        description: 'Portable Document Format',
        filename: 'internal-pdf-viewer',
      };
      Object.defineProperty(navigator, 'plugins', {
        get: () => [plugin, plugin, plugin],
      });

      // Prevent CDP detection via console.debug
      const originalDebug = console.debug;
      console.debug = function(...args) {
        if (args[0] === 'page.on' || args[0]?.includes?.('CDP')) return;
        return originalDebug.apply(console, args);
      };

      // Prevent Chrome specific getters
      const getChromeProps = () => ({});
      window.chrome = new Proxy({}, {
        get: (target, prop) => {
          if (prop === 'runtime') return { id: 'extensionid', onMessage: { addListener: () => {} } };
          return getChromeProps();
        },
      });

      // Prevent Chrome client hints detection
      if (Object.getOwnPropertyDescriptor(window, 'navigator').get) {
        const navProxy = new Proxy(navigator, {
          get: (target, prop) => {
            if (prop === 'userAgentData') return undefined;
            if (prop === 'deviceMemory') return 8;
            if (prop === 'hardwareConcurrency') return 4;
            return target[prop];
          },
        });
        Object.defineProperty(window, 'navigator', {
          value: navProxy,
          writable: false,
          configurable: false,
        });
      }

      // Block performance API abuse for timing attacks
      const originalPerformanceNow = performance.now;
      performance.now = function() {
        return originalPerformanceNow.call(performance) + Math.random() * 10;
      };

      // Mimic real browser history
      window.history.length = Math.floor(Math.random() * 20) + 5;
    });

    // Request interception for request header manipulation
    await this.page.setRequestInterception(true);
    this.page.on('request', interceptedRequest => {
      const headers = interceptedRequest.headers();

      // Add realistic request headers
      headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
      headers['accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
      headers['accept-language'] = 'en-US,en;q=0.9';
      headers['accept-encoding'] = 'gzip, deflate, br';
      headers['cache-control'] = 'max-age=0';
      headers['pragma'] = 'no-cache';
      headers['upgrade-insecure-requests'] = '1';
      headers['sec-fetch-dest'] = 'document';
      headers['sec-fetch-mode'] = 'navigate';
      headers['sec-fetch-site'] = 'none';
      headers['sec-fetch-user'] = '?1';

      // Add realistic timing variations
      if (Math.random() > 0.7) {
        headers['sec-ch-ua'] = '"Not A(Brand";v="99", "Google Chrome";v="120"';
        headers['sec-ch-ua-mobile'] = '?0';
        headers['sec-ch-ua-platform'] = '"Windows"';
      }

      interceptedRequest.continue({ headers });
    });
  }

  async scroll(element = null, steps = 5) {
    for (let i = 0; i < steps; i++) {
      await this.page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await new Promise(r => setTimeout(r, this.randomDelay()));
    }
  }

  async click(selector, options = {}) {
    const delay = this.randomDelay();

    // Human-like mouse movement
    const element = await this.page.$(selector);
    if (!element) throw new Error(`Element not found: ${selector}`);

    const box = await element.boundingBox();
    const x = box.x + box.width / 2 + (Math.random() - 0.5) * 10;
    const y = box.y + box.height / 2 + (Math.random() - 0.5) * 10;

    await this.page.mouse.move(x - 50, y - 50);
    await new Promise(r => setTimeout(r, Math.random() * 300 + 100));

    // Smooth mouse movement to target
    for (let i = 0; i < 5; i++) {
      const targetX = x - (x - (x - 50)) * (1 - i / 5);
      const targetY = y - (y - (y - 50)) * (1 - i / 5);
      await this.page.mouse.move(targetX, targetY);
      await new Promise(r => setTimeout(r, 50));
    }

    await this.page.mouse.click(x, y);
    await new Promise(r => setTimeout(r, delay));
  }

  async type(selector, text, options = {}) {
    const delay = options.delay || 50;

    await this.page.focus(selector);
    await new Promise(r => setTimeout(r, this.randomDelay()));

    for (const char of text) {
      await this.page.keyboard.type(char);
      await new Promise(r => setTimeout(r, delay + Math.random() * 100 - 50));
    }

    await new Promise(r => setTimeout(r, this.randomDelay()));
  }

  async detectProtection(url) {
    if (!this.page) await this.launch();

    const detection = {
      url,
      timestamp: new Date().toISOString(),
      detectedVectors: [],
      vulnerabilities: [],
    };

    try {
      await this.page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      // Test for common bot detection libraries
      const jsDetection = await this.page.evaluate(() => {
        const checks = {
          recaptcha: typeof grecaptcha !== 'undefined',
          hcaptcha: typeof hcaptcha !== 'undefined',
          botProtect: typeof document.querySelector('[data-sitekey]') !== null,
          cloudflare: document.body.innerHTML.includes('Cloudflare'),
          imperva: document.body.innerHTML.includes('Imperva'),
          akamaiRum: typeof window.AkamaiRUM !== 'undefined',
          datadome: typeof dd_config !== 'undefined',
          perimeterx: typeof _pxAppId !== 'undefined',
        };

        return checks;
      });

      detection.detectedVectors.push(...Object.entries(jsDetection)
        .filter(([_, detected]) => detected)
        .map(([lib]) => lib));

      // Test CDP detection
      const cdpDetected = await this.page.evaluate(() => {
        try {
          if (navigator.webdriver) return 'webdriver-detected';
          if (window.document.documentElement.getAttribute('webdriver')) return 'dom-webdriver';
          if (window.__cdc_alarms__ || window.__cdc_alloc__) return 'cdp-properties';
          return null;
        } catch { return null; }
      });

      if (cdpDetected) detection.vulnerabilities.push(cdpDetected);

      // Check for rate limiting
      const response = await this.page.goto(url, { waitUntil: 'domcontentloaded' });
      if (response.status() === 429 || response.status() === 403) {
        detection.vulnerabilities.push(`HTTP-${response.status()}`);
      }

      // Check for JavaScript anti-bot
      const consoleMessages = [];
      this.page.on('console', msg => {
        if (msg.type() === 'error' || msg.text().includes('bot')) {
          consoleMessages.push(msg.text());
        }
      });

      await this.page.waitForTimeout(2000);
      if (consoleMessages.length > 0) {
        detection.vulnerabilities.push(`console-warnings: ${consoleMessages.length}`);
      }

    } catch (error) {
      detection.error = error.message;
    }

    return detection;
  }

  async auditBotDetection(url) {
    if (!this.page) await this.launch();

    const audit = {
      url,
      timestamp: new Date().toISOString(),
      profile: this.profile.name,
      detectionVectors: await this.detectProtection(url),
      recommendations: [],
    };

    // Add recommendations based on detection
    if (audit.detectionVectors.detectedVectors.includes('recaptcha')) {
      audit.recommendations.push('Site uses reCAPTCHA - may require human intervention');
    }
    if (audit.detectionVectors.vulnerabilities.includes('HTTP-429')) {
      audit.recommendations.push('Rate limiting detected - implement request spacing');
    }
    if (audit.detectionVectors.vulnerabilities.some(v => v.includes('cdp'))) {
      audit.recommendations.push('CDP detection present - ensure full stealth plugin coverage');
    }

    return audit;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = AdvancedAntiDetection;

// CLI usage
if (require.main === module) {
  const url = process.argv[2] || 'https://example.com';

  (async () => {
    const detector = new AdvancedAntiDetection();

    try {
      const result = await detector.auditBotDetection(url);
      console.log(JSON.stringify(result, null, 2));
    } finally {
      await detector.close();
    }
  })();
}
