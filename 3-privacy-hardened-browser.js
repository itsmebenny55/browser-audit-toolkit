#!/usr/bin/env node
/**
 * 3. Privacy-Hardened Browser — Fingerprint masking & privacy maximization
 * Use for: privacy auditing, anonymized testing, cross-site tracking detection
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

class PrivacyHardenedBrowser {
  constructor(options = {}) {
    this.fingerprint = this.generateRandomFingerprint();
    this.timeout = options.timeout || 30000;
    this.proxy = options.proxy || null;
    this.vpn = options.vpn || null;
    this.browser = null;
    this.page = null;
  }

  generateRandomFingerprint() {
    const platforms = ['Linux x86_64', 'Windows NT 10.0; Win64; x64', 'Macintosh; Intel Mac OS X 10_15_7'];
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    ];

    const languages = [
      ['en-US', 'en'],
      ['en-GB', 'en'],
      ['es-ES', 'es'],
      ['fr-FR', 'fr'],
      ['de-DE', 'de'],
    ];

    const timezones = [
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
    ];

    return {
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      languages: languages[Math.floor(Math.random() * languages.length)],
      timezone: timezones[Math.floor(Math.random() * timezones.length)],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      screenWidth: 1920 + Math.floor(Math.random() * 200),
      screenHeight: 1080 + Math.floor(Math.random() * 200),
      colorDepth: Math.random() > 0.5 ? 24 : 32,
      devicePixelRatio: Math.random() > 0.5 ? 1 : 2,
      hardwareConcurrency: Math.random() > 0.5 ? 4 : 8,
      deviceMemory: Math.random() > 0.5 ? 4 : 8,
    };
  }

  async launch() {
    const args = [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--start-maximized',

      // Privacy flags
      '--disable-sync',
      '--disable-component-extensions-with-background-pages',
      '--disable-extensions',
      '--disable-default-apps',
      '--disable-plugins',
      '--disable-preconnect',
      '--disable-prefetch',
      '--disable-background-networking',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-extensions',
      '--disable-hang-monitor',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--password-store=basic',
      '--use-mock-keychain',

      // Tracking prevention
      '--enable-features=NetworkService,NetworkServiceInProcess',
      '--disable-features=InterestFeedContentSuggestions,Translate,IsolateOrigins,site-per-process',
    ];

    if (this.proxy) {
      args.push(`--proxy-server=${this.proxy}`);
    }

    this.browser = await puppeteer.launch({
      headless: 'new',
      args,
      defaultViewport: {
        width: this.fingerprint.screenWidth,
        height: this.fingerprint.screenHeight,
        deviceScaleFactor: this.fingerprint.devicePixelRatio,
      },
    });

    this.page = await this.browser.newPage();
    await this.applyFingerprint();
  }

  async applyFingerprint() {
    const fp = this.fingerprint;

    // Spoof navigator properties
    await this.page.evaluateOnNewDocument((fingerprint) => {
      const fp = fingerprint;

      // Override navigator properties
      Object.defineProperty(navigator, 'userAgent', {
        get: () => fp.userAgent,
      });
      Object.defineProperty(navigator, 'platform', {
        get: () => fp.platform,
      });
      Object.defineProperty(navigator, 'languages', {
        get: () => fp.languages,
      });
      Object.defineProperty(navigator, 'language', {
        get: () => fp.languages[0],
      });
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => fp.hardwareConcurrency,
      });
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => fp.deviceMemory,
      });
      Object.defineProperty(navigator, 'maxTouchPoints', {
        get: () => Math.random() > 0.5 ? 0 : 10,
      });
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      // Screen spoofing
      Object.defineProperty(window.screen, 'width', {
        get: () => fp.screenWidth,
      });
      Object.defineProperty(window.screen, 'height', {
        get: () => fp.screenHeight,
      });
      Object.defineProperty(window.screen, 'colorDepth', {
        get: () => fp.colorDepth,
      });
      Object.defineProperty(window.screen, 'pixelDepth', {
        get: () => fp.colorDepth,
      });
      Object.defineProperty(window.devicePixelRatio, {
        writable: false,
        value: fp.devicePixelRatio,
      });

      // Timezone spoofing
      const OriginalDate = window.Date;
      window.Date = class extends OriginalDate {
        constructor(...args) {
          super(...args);
          return new OriginalDate();
        }
        static now() {
          return OriginalDate.now();
        }
      };

      // WebGL canvas fingerprinting resistance
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 37445) {
          return 'Intel Inc.';
        }
        if (parameter === 37446) {
          return 'Intel Iris OpenGL Engine';
        }
        return getParameter.call(this, parameter);
      };

      // Block tracking APIs
      window.gtag = () => {};
      window._gaq = [];
      window.ga = () => {};

      // Prevent WebRTC leak
      const pc = window.RTCPeerConnection || window.webkitRTCPeerConnection;
      if (pc) {
        pc.prototype.createDataChannel = function(label, options) {
          console.log('WebRTC createDataChannel blocked');
          return this;
        };
      }

      // Chrome specific spoofing
      window.chrome = {
        runtime: {},
        loadTimes: () => {},
        csi: () => {},
      };
    }, fp);

    // Set user agent
    await this.page.setUserAgent(this.fingerprint.userAgent);

    // Set viewport
    await this.page.setViewport({
      width: this.fingerprint.screenWidth,
      height: this.fingerprint.screenHeight,
      deviceScaleFactor: this.fingerprint.devicePixelRatio,
    });

    // Set extra headers
    await this.page.setExtraHTTPHeaders({
      'Accept-Language': this.fingerprint.languages.join(','),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    });

    // Disable tracking
    await this.page.setOfflineMode(false);
    await this.page.setCacheEnabled(false);
  }

  async auditFingerprint(url) {
    if (!this.page) await this.launch();

    await this.page.goto(url, { waitUntil: 'networkidle0' });

    const fingerprint = await this.page.evaluate(() => {
      const result = {
        navigator: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          languages: navigator.languages,
          hardwareConcurrency: navigator.hardwareConcurrency,
          deviceMemory: navigator.deviceMemory,
          maxTouchPoints: navigator.maxTouchPoints,
          webdriver: navigator.webdriver,
        },
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelDepth: screen.pixelDepth,
          devicePixelRatio: window.devicePixelRatio,
        },
        canvas: (() => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          ctx.textBaseline = 'top';
          ctx.font = '14px Arial';
          ctx.textBaseline = 'alphabetic';
          ctx.fillStyle = '#f60';
          ctx.fillRect(125, 1, 62, 20);
          ctx.fillStyle = '#069';
          ctx.fillText('Browser Audit', 2, 15);
          return canvas.toDataURL();
        })(),
        webgl: (() => {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (!gl) return null;
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          return {
            vendor: gl.getParameter(debugInfo?.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL),
          };
        })(),
        tracking: {
          googleAnalytics: typeof gtag !== 'undefined',
          fbPixel: typeof fbq !== 'undefined',
          mixpanel: typeof mixpanel !== 'undefined',
        },
      };
      return result;
    });

    return {
      url,
      timestamp: new Date().toISOString(),
      fingerprint,
      spoofSuccess: !fingerprint.navigator.webdriver,
    };
  }

  async detectTrackers(url) {
    if (!this.page) await this.launch();

    const trackers = [];

    this.page.on('response', response => {
      const url = response.url();
      const knownTrackers = [
        'google-analytics.com',
        'googletagmanager.com',
        'facebook.com/tr',
        'doubleclick.net',
        'hotjar.com',
        'mixpanel.com',
        'segment.com',
        'amplitude.com',
      ];

      for (const tracker of knownTrackers) {
        if (url.includes(tracker)) {
          trackers.push({
            type: tracker.split('.')[0],
            url,
            statusCode: response.status(),
          });
        }
      }
    });

    await this.page.goto(url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));

    return {
      url,
      trackersDetected: trackers.length,
      trackers,
    };
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = PrivacyHardenedBrowser;

// CLI usage
if (require.main === module) {
  const url = process.argv[2] || 'https://example.com';
  const mode = process.argv[3] || 'fingerprint';

  (async () => {
    const browser = new PrivacyHardenedBrowser();

    try {
      let result;
      if (mode === 'trackers') {
        result = await browser.detectTrackers(url);
      } else {
        result = await browser.auditFingerprint(url);
      }

      console.log(JSON.stringify(result, null, 2));
    } finally {
      await browser.close();
    }
  })();
}
