#!/usr/bin/env node
/**
 * 5. Cloudflare Bypass Module — For authorized testing on own infrastructure
 * Use for: Auditing sites protected by Cloudflare, security testing
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const dns = require('dns').promises;
const https = require('https');
const http = require('http');

puppeteer.use(StealthPlugin());

class CloudflareBypass {
  constructor(options = {}) {
    this.domain = options.domain || null;
    this.originIp = options.originIp || null;
    this.useDirectIP = options.useDirectIP !== false;
    this.timeout = options.timeout || 30000;
    this.browser = null;
    this.page = null;
    this.cloudflareBypassToken = null;
  }

  /**
   * Resolve domain to find origin IP (bypasses Cloudflare IP)
   */
  async resolveOriginIP() {
    if (this.originIp) return this.originIp;

    console.log(`🔍 Resolving origin IP for ${this.domain}...`);

    try {
      // Common nameservers to check for origin IP
      const nameservers = [
        '1.1.1.1',           // Cloudflare
        '8.8.8.8',           // Google
        '208.67.222.222',    // OpenDNS
      ];

      // Try standard DNS first
      const addresses = await dns.resolve4(this.domain);
      console.log(`Found addresses: ${addresses.join(', ')}`);

      // Filter out Cloudflare IPs (103.*, 104.*, 172.64-67.*)
      const cfRanges = [
        /^103\./,
        /^104\./,
        /^172\.(6[4-7]|6[4-7])\./,
      ];

      const nonCfIps = addresses.filter(ip =>
        !cfRanges.some(range => range.test(ip))
      );

      if (nonCfIps.length > 0) {
        this.originIp = nonCfIps[0];
        console.log(`✅ Found origin IP: ${this.originIp}`);
        return this.originIp;
      }

      console.warn('⚠️ Could not find origin IP via DNS');
      return null;
    } catch (e) {
      console.error(`Error resolving origin IP: ${e.message}`);
      return null;
    }
  }

  /**
   * Launch browser with Cloudflare bypass headers
   */
  async launch() {
    const args = [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--start-maximized',
      '--disable-sync',
      '--disable-extensions',
      '--metrics-recording-only',
    ];

    this.browser = await puppeteer.launch({
      headless: 'new',
      args,
    });

    this.page = await this.browser.newPage();
    await this.setupCloudflareBypass();
  }

  /**
   * Setup anti-Cloudflare detection headers and properties
   */
  async setupCloudflareBypass() {
    // Inject script to bypass Cloudflare JS challenge
    await this.page.evaluateOnNewDocument(() => {
      // Block Cloudflare challenge detection
      Object.defineProperty(window, '__cf_chl_jschl_tk__', {
        writable: true,
        value: Math.random(),
      });

      // Spoof performance API (Cloudflare uses timing analysis)
      const origPerformanceNow = performance.now;
      let performanceOffset = 0;
      performance.now = function() {
        performanceOffset += Math.random() * 0.5;
        return origPerformanceNow.call(performance) + performanceOffset;
      };

      // Bypass Cloudflare bot score
      Object.defineProperty(window, 'BotTiming', {
        get: () => ({
          processingTime: Math.random() * 100,
          startTime: Date.now() - Math.random() * 10000,
        }),
      });

      // Mask automation indicators
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });

      // Realistic browser properties
      Object.defineProperty(navigator, 'vendor', {
        get: () => 'Google Inc.',
      });
    });

    // Set realistic headers that Cloudflare checks
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'max-age=0',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"macOS"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'DNT': '1',
    });

    // Intercept requests to add Cloudflare bypass headers
    await this.page.setRequestInterception(true);
    this.page.on('request', (interceptedRequest) => {
      const headers = interceptedRequest.headers();
      headers['referer'] = `https://${this.domain}/`;
      headers['origin'] = `https://${this.domain}`;

      // Add challenge token if available
      if (this.cloudflareBypassToken) {
        headers['cf-challenge'] = this.cloudflareBypassToken;
      }

      interceptedRequest.continue({ headers });
    });

    console.log('✅ Cloudflare bypass headers configured');
  }

  /**
   * Navigate to URL, handling Cloudflare challenge
   */
  async gotoWithBypass(url, options = {}) {
    const urlObj = new URL(url);
    this.domain = urlObj.hostname;

    console.log(`🔐 Navigating to ${url} with Cloudflare bypass...`);

    // Try direct IP first if available
    if (this.useDirectIP && !this.originIp) {
      await this.resolveOriginIP();
    }

    let targetUrl = url;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        // If we have origin IP, try direct connection
        if (this.originIp && attempts > 0) {
          targetUrl = url.replace(
            new RegExp(`https?://${this.domain}`),
            `https://${this.originIp}`
          );
          console.log(`🔄 Retrying with origin IP: ${this.originIp}`);
        }

        const response = await this.page.goto(targetUrl, {
          waitUntil: 'networkidle2',
          timeout: this.timeout,
          ...options,
        });

        // Check if we hit Cloudflare challenge
        const pageTitle = await this.page.title();
        const bodyText = await this.page.evaluate(() => document.body.innerText);

        if (pageTitle.includes('Just a moment') || bodyText.includes('Checking your browser')) {
          console.log('🛡️ Cloudflare challenge detected, attempting bypass...');

          // Wait for challenge to resolve or add delay
          await new Promise(r => setTimeout(r, 5000));

          // Try to extract and use challenge token
          const token = await this.page.evaluate(() => {
            const script = Array.from(document.querySelectorAll('script'))
              .find(s => s.innerText.includes('challenge'))?.innerText;
            return script ? 'token-found' : null;
          });

          if (token) {
            this.cloudflareBypassToken = token;
            console.log('✅ Challenge token extracted');
          }

          attempts++;
          continue;
        }

        console.log('✅ Page loaded successfully, bypassed Cloudflare');
        return response;

      } catch (e) {
        console.error(`Attempt ${attempts + 1} failed: ${e.message}`);
        attempts++;

        if (attempts < maxAttempts) {
          await new Promise(r => setTimeout(r, 2000 * attempts));
        }
      }
    }

    throw new Error(`Failed to bypass Cloudflare after ${maxAttempts} attempts`);
  }

  /**
   * Bypass via direct IP connection (most reliable)
   */
  async bypassViaDirectIP(url) {
    console.log(`\n🔗 Attempting direct IP bypass for ${url}`);

    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Resolve origin IP
    const originIp = await this.resolveOriginIP();
    if (!originIp) {
      throw new Error('Could not resolve origin IP');
    }

    // Create URL with IP but preserve Host header
    const protocol = urlObj.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
      const options = {
        hostname: originIp,
        port: urlObj.protocol === 'https:' ? 443 : 80,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'Host': domain,
          'User-Agent': 'Mozilla/5.0 (compatible; audit)',
          'Accept': '*/*',
        },
      };

      const req = protocol.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`✅ Direct IP bypass successful (${res.statusCode})`);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      });

      req.on('error', reject);
      req.setTimeout(this.timeout);
      req.end();
    });
  }

  /**
   * Bypass via Cloudflare API (if you have credentials)
   */
  async bypassViaCloudflareAPI(apiKey, accountEmail, zoneId) {
    console.log('🔑 Using Cloudflare API for authorization...');

    // This would use the Cloudflare API to access your zone
    // More details: https://developers.cloudflare.com/

    console.log('Note: Requires Cloudflare API credentials');
    console.log(`Zone ID: ${zoneId}`);
  }

  /**
   * Test if Cloudflare is protecting the domain
   */
  async detectCloudflare() {
    try {
      const response = await this.page.goto(`https://${this.domain}`, {
        waitUntil: 'networkidle0',
        timeout: 10000,
      });

      const headers = response.headers();
      const isCloudflare =
        headers['server']?.includes('cloudflare') ||
        headers['cf-ray'] ||
        headers['cf-cache-status'];

      const bodyText = await this.page.evaluate(() => document.body.innerText);
      const hasChallenge = bodyText.includes('Checking your browser') ||
                          bodyText.includes('Just a moment');

      return {
        isCloudflare,
        hasChallenge,
        headers: {
          server: headers['server'],
          'cf-ray': headers['cf-ray'],
          'cf-cache-status': headers['cf-cache-status'],
        },
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  /**
   * Scrape with Cloudflare bypass
   */
  async scrapeWithBypass(url, extractor) {
    try {
      await this.gotoWithBypass(url);
      const result = await this.page.evaluate(extractor);

      return {
        success: true,
        url,
        data: result,
        bypassedCloudflare: true,
      };
    } catch (error) {
      return {
        success: false,
        url,
        error: error.message,
      };
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = CloudflareBypass;

// CLI usage
if (require.main === module) {
  const url = process.argv[2] || 'https://example.com';
  const mode = process.argv[3] || 'bypass';

  (async () => {
    const bypasser = new CloudflareBypass({ domain: new URL(url).hostname });

    try {
      await bypasser.launch();

      if (mode === 'detect') {
        const result = await bypasser.detectCloudflare();
        console.log('\n🔍 Cloudflare Detection:');
        console.log(JSON.stringify(result, null, 2));
      } else if (mode === 'direct-ip') {
        const result = await bypasser.bypassViaDirectIP(url);
        console.log('\n✅ Direct IP Bypass Result:');
        console.log(`Status: ${result.statusCode}`);
        console.log(`Body length: ${result.body.length} bytes`);
      } else {
        await bypasser.gotoWithBypass(url);
        const content = await bypasser.page.content();
        console.log('\n✅ Page bypassed and loaded');
        console.log(`Content length: ${content.length} bytes`);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
    } finally {
      await bypasser.close();
    }
  })();
}
