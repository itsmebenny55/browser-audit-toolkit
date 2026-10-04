#!/usr/bin/env node
/**
 * 1. Headless Chromium Tester — Fast, lightweight testing for own sites
 * Use for: regression tests, CI/CD pipelines, basic performance audits
 */

const { execSync } = require('child_process');
const path = require('path');

class HeadlessChromiumTester {
  constructor(options = {}) {
    this.chromiumPath = options.chromiumPath || this.findChromium();
    this.timeout = options.timeout || 30000;
    this.viewport = options.viewport || { width: 1920, height: 1080 };
    this.userAgent = options.userAgent || null;
  }

  findChromium() {
    const paths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/usr/bin/chromium',
      '/usr/bin/google-chrome',
      '/snap/bin/chromium',
    ];

    for (const p of paths) {
      try {
        execSync(`test -x "${p}"`, { stdio: 'ignore' });
        return p;
      } catch {}
    }
    throw new Error('Chromium not found');
  }

  async testPage(url, checks = {}) {
    const script = this.buildScript(url, checks);
    const tmpFile = `/tmp/chrome-audit-${Date.now()}.js`;

    require('fs').writeFileSync(tmpFile, script);

    try {
      const args = [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        `--window-size=${this.viewport.width},${this.viewport.height}`,
        `--run-all-compositor-stages-before-draw`,
        '--enable-automation',
        `--devtools-protocol-format=json`,
        `--remote-debugging-port=0`,
      ];

      if (this.userAgent) {
        args.push(`--user-agent=${this.userAgent}`);
      }

      args.push(`--run-script=${tmpFile}`);

      const result = execSync(`"${this.chromiumPath}" ${args.join(' ')}`, {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
        timeout: this.timeout,
      });

      return JSON.parse(result);
    } finally {
      require('fs').unlinkSync(tmpFile);
    }
  }

  buildScript(url, checks) {
    const checksList = Object.entries(checks)
      .map(([name, fn]) => `results['${name}'] = ${fn.toString()};`)
      .join('\n  ');

    return `
      (async () => {
        const results = {};
        const url = '${url}';

        try {
          const response = await fetch(url);
          results.statusCode = response.status;
          results.headers = Object.fromEntries(response.headers);
          results.html = await response.text();

          // Parse DOM
          const parser = new (require('jsdom')).JSDOM;
          const dom = new parser.constructor(results.html);
          const doc = dom.window.document;

          // Built-in checks
          results.title = doc.title;
          results.h1Count = doc.querySelectorAll('h1').length;
          results.imagesCount = doc.querySelectorAll('img').length;
          results.linksCount = doc.querySelectorAll('a').length;
          results.scriptCount = doc.querySelectorAll('script').length;
          results.styleCount = doc.querySelectorAll('style, link[rel="stylesheet"]').length;
          results.metaTags = Array.from(doc.querySelectorAll('meta')).map(m => ({
            name: m.getAttribute('name'),
            content: m.getAttribute('content'),
          }));

          // Custom checks
          ${checksList}

          results.success = true;
        } catch (e) {
          results.error = e.message;
          results.success = false;
        }

        console.log(JSON.stringify(results, null, 2));
      })();
    `;
  }
}

module.exports = HeadlessChromiumTester;

// CLI usage
if (require.main === module) {
  const url = process.argv[2] || 'https://example.com';
  const tester = new HeadlessChromiumTester();

  tester.testPage(url, {
    hasMetaViewport: `doc.querySelector('meta[name="viewport"]') !== null`,
    hasCSP: `doc.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null`,
    noConsoleErrors: `!results.html.includes('console.error')`,
  }).then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
