/**
 * Browser Audit Toolkit — Export all strategies
 */

module.exports = {
  HeadlessChromiumTester: require('./1-headless-chromium-tester'),
  PuppeteerStealthScraper: require('./2-puppeteer-stealth-scraper'),
  PrivacyHardenedBrowser: require('./3-privacy-hardened-browser'),
  AdvancedAntiDetection: require('./4-advanced-anti-detection'),
  CloudflareBypass: require('./5-cloudflare-bypass'),
};
