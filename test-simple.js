const PuppeteerStealth = require('./2-puppeteer-stealth-scraper');

(async () => {
  const scraper = new PuppeteerStealth({ headless: true });
  await scraper.launch();
  
  console.log('✅ Browser launched successfully');
  console.log('🦊 Using stealth plugin for anti-detection');
  
  try {
    const result = await scraper.scrape('https://httpbin.org/json', () => ({
      title: document.title,
      bodyText: document.body.textContent.substring(0, 100),
    }));
    
    console.log('\n✅ TEST PASSED - Scraping works!');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch(e) {
    console.error('❌ TEST FAILED:', e.message);
  }
  
  await scraper.close();
})();
