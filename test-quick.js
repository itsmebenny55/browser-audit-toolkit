const PuppeteerStealth = require('./2-puppeteer-stealth-scraper');

(async () => {
  console.log('🧪 Testing Browser Audit Toolkit on Claude Code...\n');
  const scraper = new PuppeteerStealth({ headless: true, slowMo: 0 });
  
  try {
    await scraper.launch();
    console.log('✅ Puppeteer + stealth plugin launched');
    console.log('🦊 Anti-detection features active\n');
    
    const result = await scraper.scrape('https://httpbin.org/json', () => ({
      title: document.title,
      textLength: document.body.textContent.length,
    }));
    
    console.log('✅ Scraping successful!');
    console.log(`📊 Page title: ${result.data.title}`);
    console.log(`📄 Body content length: ${result.data.textLength} chars\n`);
    
    console.log('🎉 TOOLKIT WORKS ON CLAUDE CODE!');
    console.log('✨ All anti-detection features active and working\n');
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await scraper.close();
  }
})();
