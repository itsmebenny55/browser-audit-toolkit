#!/usr/bin/env node
/**
 * Camoufox Stealth Configuration
 * Uses camoufox (Firefox-based anti-detection browser) for maximum stealth
 */

const puppeteer = require('puppeteer');
const { addExtra } = require('puppeteer-extra');

// Use camoufox launch configuration
const camoufoxConfig = {
  headless: 'new',
  executablePath: process.env.CAMOUFOX_PATH || '/Applications/Camoufox.app/Contents/MacOS/firefox',
  args: [
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-shm-usage',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--start-maximized',
    '--disable-sync',
    '--disable-extensions',
    '--disable-plugins',
    '--disable-default-apps',
    '--disable-web-resources',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--metrics-recording-only',
    '--no-first-run',
    '--no-default-browser-check',
    '--password-store=basic',
    '--use-mock-keychain',
    '--mute-audio',
    '--disable-background-networking',
    '--disable-features=InterestFeedContentSuggestions,Translate',
  ],
};

// Enhanced camoufox stealth spoofing
const camoufoxStealth = async (page) => {
  // Camoufox already has built-in stealth, but add extra layers
  await page.evaluateOnNewDocument(() => {
    // Additional Firefox spoofing
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });

    // Spoof plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });

    // Block detection via automation
    window.chrome = {
      runtime: {
        onInstalled: { addListener: () => {} },
        onMessage: { addListener: () => {} },
      },
    };

    // Prevent CDP/WebDriver detection
    const handler = {
      get: (target, prop) => {
        if (prop === 'webdriver') return undefined;
        return target[prop];
      },
    };

    const navigatorProxy = new Proxy(navigator, handler);
    Object.defineProperty(window, 'navigator', {
      value: navigatorProxy,
      writable: false,
    });

    // Firefox specific: mask as real browser
    Object.defineProperty(navigator, 'vendor', {
      get: () => '',
    });

    Object.defineProperty(navigator, 'userAgent', {
      get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    });
  });
};

class CamoufoxBrowser {
  constructor(options = {}) {
    this.config = { ...camoufoxConfig, ...options };
    this.browser = null;
    this.page = null;
  }

  async launch() {
    try {
      // Try camoufox first
      this.browser = await puppeteer.launch(this.config);
      console.log('✅ Launched with camoufox (Firefox-based stealth)');
    } catch (e) {
      console.warn('⚠️ Camoufox not available, falling back to Chromium:', e.message);
      // Fallback to regular Chromium
      this.browser = await puppeteer.launch({
        headless: 'new',
      });
    }

    this.page = await this.browser.newPage();
    await camoufoxStealth(this.page);
  }

  async goto(url, options = {}) {
    return await this.page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
      ...options,
    });
  }

  async evaluate(fn, ...args) {
    return await this.page.evaluate(fn, ...args);
  }

  async $(selector) {
    return await this.page.$(selector);
  }

  async $$(selector) {
    return await this.page.$$(selector);
  }

  async click(selector, options = {}) {
    // Human-like click with camoufox
    await this.page.click(selector, options);
  }

  async type(selector, text, options = {}) {
    await this.page.type(selector, text, { delay: 75, ...options });
  }

  async getContent() {
    return await this.page.content();
  }

  async metrics() {
    return await this.page.metrics();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = { CamoufoxBrowser, camoufoxConfig, camoufoxStealth };
