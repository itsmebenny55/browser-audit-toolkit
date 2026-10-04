const puppeteer = require('puppeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteerExtra = require('puppeteer-extra');

puppeteerExtra.use(StealthPlugin());

const testSites = [
  'about:blank',
  'data:text/html,<h1>Test 1</h1>',
  'data:text/html,<h1>Test 2</h1><p>Multi-site testing</p>',
];

(async () => {
  console.log('\n🌐 MULTI-SITE STEALTH BROWSER TEST\n');
  console.log('Testing anti-detection across multiple pages...\n');
  
  const browser = await puppeteerExtra.launch({ headless: true });
  
  let passed = 0;
  let failed = 0;
  
  for (const site of testSites) {
    try {
      const page = await browser.newPage();
      
      // Set stealth headers
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      });
      
      await page.goto(site, { waitUntil: 'domcontentloaded' });
      
      const result = await page.evaluate(() => ({
        url: window.location.href,
        title: document.title || document.querySelector('h1')?.textContent || 'N/A',
        webdriver: navigator.webdriver === true ? 'DETECTED ❌' : 'hidden ✅',
        plugins: navigator.plugins.length,
      }));
      
      console.log(`✅ ${result.url}`);
      console.log(`   Title: ${result.title}`);
      console.log(`   Webdriver: ${result.webdriver}`);
      console.log(`   Plugins: ${result.plugins}\n`);
      
      passed++;
      await page.close();
      
    } catch(e) {
      console.error(`❌ Failed: ${e.message}\n`);
      failed++;
    }
  }
  
  await browser.close();
  
  console.log(`📊 Results: ${passed} passed, ${failed} failed`);
  console.log(`🎉 Multi-site stealth testing ${failed === 0 ? 'SUCCESSFUL ✨' : 'PARTIAL'}\n`);
})();
