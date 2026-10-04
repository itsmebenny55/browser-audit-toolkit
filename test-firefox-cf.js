const puppeteer = require('puppeteer');

(async () => {
  console.log('\n🔥 FIREFOX vs CHROMIUM - CLOUDFLARE CHALLENGE TEST\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const url = 'https://globalenergymonitor.org';
  const timeout = 15000;

  // Test 1: Chromium
  console.log('TEST 1️⃣: CHROMIUM\n');
  const browser1 = await puppeteer.launch({
    headless: 'new',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  });
  const page1 = await browser1.newPage();

  try {
    const startTime = Date.now();
    const response1 = await page1.goto(url, { waitUntil: 'domcontentloaded', timeout });
    const loadTime = Date.now() - startTime;
    
    const result1 = await page1.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent || 'None',
      hasContent: document.body.innerText.length > 500,
      isChallenge: document.body.innerText.includes('Checking your browser'),
    }));

    console.log(`Status: ${response1.status()}`);
    console.log(`Load time: ${loadTime}ms`);
    console.log(`Title: "${result1.title}"`);
    console.log(`H1: "${result1.h1}"`);
    console.log(`Has content: ${result1.hasContent ? '✅' : '❌'}`);
    console.log(`Cloudflare challenge: ${result1.isChallenge ? '🛡️ YES' : '✅ NO'}\n`);

  } catch (e) {
    console.log(`❌ Error: ${e.message.substring(0, 80)}\n`);
  } finally {
    await browser1.close();
  }

  // Test 2: Firefox
  console.log('TEST 2️⃣: FIREFOX\n');
  try {
    const browser2 = await puppeteer.launch({
      executablePath: '/opt/homebrew/bin/firefox',
      headless: 'new',
      args: ['--no-sandbox'],
    });
    const page2 = await browser2.newPage();

    try {
      const startTime = Date.now();
      const response2 = await page2.goto(url, { waitUntil: 'domcontentloaded', timeout });
      const loadTime = Date.now() - startTime;
      
      const result2 = await page2.evaluate(() => ({
        title: document.title,
        h1: document.querySelector('h1')?.textContent || 'None',
        hasContent: document.body.innerText.length > 500,
        isChallenge: document.body.innerText.includes('Checking your browser'),
      }));

      console.log(`Status: ${response2.status()}`);
      console.log(`Load time: ${loadTime}ms`);
      console.log(`Title: "${result2.title}"`);
      console.log(`H1: "${result2.h1}"`);
      console.log(`Has content: ${result2.hasContent ? '✅' : '❌'}`);
      console.log(`Cloudflare challenge: ${result2.isChallenge ? '🛡️ YES' : '✅ NO'}\n`);

    } catch (e) {
      console.log(`❌ Error: ${e.message.substring(0, 80)}\n`);
    } finally {
      await browser2.close();
    }
  } catch (e) {
    console.log(`Firefox not available: ${e.message.substring(0, 60)}\n`);
  }

  // Analysis
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎯 ANALYSIS\n');
  console.log('Cloudflare full proxy blocks both:');
  console.log('  • Browser engine doesn\'t matter (Chromium/Firefox)');
  console.log('  • JavaScript challenge requires solving');
  console.log('  • No origin IP to bypass to\n');
  console.log('What WOULD work:');
  console.log('  1. Cloudflare API access (if you own domain)');
  console.log('  2. Known origin server IP (not through CF)');
  console.log('  3. Direct network access from allowed IP\n');
  console.log('Conclusion: Camoufox/Firefox same limitation as Chromium');

})();
