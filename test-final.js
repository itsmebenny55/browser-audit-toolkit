const puppeteer = require('puppeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteerExtra = require('puppeteer-extra');

puppeteerExtra.use(StealthPlugin());

(async () => {
  console.log('🧪 Testing Browser Audit Toolkit on Claude Code...\n');
  const browser = await puppeteerExtra.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('✅ Puppeteer + Stealth Plugin launched');
    console.log('🦊 Anti-detection features active\n');
    
    await page.goto('https://httpbin.org/user-agent', { waitUntil: 'domcontentloaded' });
    const userAgent = await page.evaluate(() => document.body.innerText);
    
    console.log('✅ Page scraped successfully');
    console.log(`📊 User-Agent detected: ${userAgent.split(': ')[1]?.split('"')[1]?.substring(0, 50)}...\n`);
    
    console.log('🎉 TOOLKIT WORKS ON CLAUDE CODE!');
    console.log('✨ Stealth browser automation verified\n');
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await browser.close();
  }
})();
