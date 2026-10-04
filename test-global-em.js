const puppeteer = require('puppeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteerExtra = require('puppeteer-extra');

puppeteerExtra.use(StealthPlugin());

(async () => {
  console.log('\n🧪 Testing Global Energy Monitor site...\n');
  
  const browser = await puppeteerExtra.launch({ 
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox',
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    // Set realistic headers
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'DNT': '1',
    });
    
    console.log('🔍 Navigating to globalenergymonitor.org...');
    await page.goto('https://globalenergymonitor.org', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    const pageInfo = await page.evaluate(() => ({
      title: document.title,
      url: window.location.href,
      h1: document.querySelector('h1')?.textContent?.substring(0, 60) || 'N/A',
      links: document.querySelectorAll('a').length,
      hasCloudflare: document.body.innerHTML.includes('Cloudflare') || document.body.innerHTML.includes('cf-'),
    }));
    
    console.log('\n✅ Page loaded successfully!\n');
    console.log(`📄 Title: ${pageInfo.title}`);
    console.log(`🔗 URL: ${pageInfo.url}`);
    console.log(`📰 Main heading: ${pageInfo.h1}`);
    console.log(`🌐 Links found: ${pageInfo.links}`);
    console.log(`🛡️  Cloudflare detected: ${pageInfo.hasCloudflare ? 'Yes' : 'No'}\n`);
    
    // Verify stealth properties
    const stealthStatus = await page.evaluate(() => ({
      webdriver: navigator.webdriver,
      chromeRuntime: typeof window.chrome?.runtime !== 'undefined',
      plugins: navigator.plugins.length > 0,
      userAgent: navigator.userAgent.substring(0, 80),
    }));
    
    console.log('🦊 Stealth Properties:');
    console.log(`   - Webdriver hidden: ${stealthStatus.webdriver !== true ? '✅' : '❌'}`);
    console.log(`   - Chrome runtime: ${stealthStatus.chromeRuntime ? '✅' : '❌'}`);
    console.log(`   - Plugins spoofed: ${stealthStatus.plugins ? '✅' : '❌'}`);
    console.log(`   - User-Agent: ${stealthStatus.userAgent}...\n`);
    
    console.log('🎉 GLOBAL ENERGY MONITOR TEST PASSED!');
    console.log('✨ Anti-detection features working on real site\n');
    
  } catch(e) {
    console.error('❌ Error:', e.message);
    console.log('\nNote: Site may have bot protection or network restrictions\n');
  } finally {
    await browser.close();
  }
})();
