const puppeteer = require('puppeteer');

(async () => {
  console.log('\n🦊 CAMOUFOX vs CHROMIUM - CLOUDFLARE TEST\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const url = 'https://globalenergymonitor.org';
  const timeout = 20000;

  // Test 1: Chromium
  console.log('TEST 1️⃣: CHROMIUM (Standard)\n');
  const browser1 = await puppeteer.launch({
    headless: 'new',
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const page1 = await browser1.newPage();

  try {
    console.log('Navigating to globalenergymonitor.org...');
    await page1.goto(url, { waitUntil: 'networkidle0', timeout });
    
    const result1 = await page1.evaluate(() => ({
      title: document.title,
      url: window.location.href,
      bypassedChallenge: !document.body.innerText.includes('Just a moment'),
      contentLength: document.body.innerText.length,
    }));

    console.log(`✅ Title: ${result1.title}`);
    console.log(`📄 URL: ${result1.url}`);
    console.log(`🛡️  Bypassed challenge: ${result1.bypassedChallenge ? '✅ YES' : '❌ NO'}`);
    console.log(`📝 Content: ${result1.contentLength} chars\n`);

  } catch (e) {
    console.log(`⏱️  Timeout/Error: ${e.message.substring(0, 60)}\n`);
  } finally {
    await browser1.close();
  }

  // Test 2: Try camoufox if available
  console.log('TEST 2️⃣: CAMOUFOX (Firefox-based)\n');
  
  const camoufoxPath = '/Users/developer/Library/Caches/camoufox/Camoufox.app/Contents/MacOS/firefox';
  
  try {
    const fs = require('fs');
    if (!fs.existsSync(camoufoxPath)) {
      console.log('⚠️  Camoufox not found at standard location');
      console.log(`   Expected: ${camoufoxPath}\n`);
    } else {
      console.log(`Found camoufox at: ${camoufoxPath}\n`);
      
      // Try to launch with camoufox
      try {
        const browser2 = await puppeteer.launch({
          executablePath: camoufoxPath,
          headless: 'new',
          args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
          ],
        });

        const page2 = await browser2.newPage();
        
        console.log('Navigating to globalenergymonitor.org with camoufox...');
        await page2.goto(url, { waitUntil: 'networkidle0', timeout });
        
        const result2 = await page2.evaluate(() => ({
          title: document.title,
          url: window.location.href,
          bypassedChallenge: !document.body.innerText.includes('Just a moment'),
          contentLength: document.body.innerText.length,
          userAgent: navigator.userAgent.substring(0, 50),
        }));

        console.log(`✅ Title: ${result2.title}`);
        console.log(`📄 URL: ${result2.url}`);
        console.log(`🛡️  Bypassed challenge: ${result2.bypassedChallenge ? '✅ YES' : '❌ NO'}`);
        console.log(`📝 Content: ${result2.contentLength} chars`);
        console.log(`🔍 Browser: Firefox (${result2.userAgent}...)\n`);

        await browser2.close();

      } catch (e) {
        console.log(`⏱️  Camoufox launch error: ${e.message.substring(0, 60)}\n`);
      }
    }
  } catch (e) {
    console.log(`Error: ${e.message}\n`);
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 COMPARISON SUMMARY\n');
  console.log('Chromium:');
  console.log('  • Standard browser engine');
  console.log('  • Puppeteer-extra stealth plugin');
  console.log('  • Limited Cloudflare bypass\n');
  console.log('Camoufox (Firefox):');
  console.log('  • Different browser engine');
  console.log('  • Built-in stealth features');
  console.log('  • Different fingerprint\n');
  console.log('Result: Both face the same Cloudflare full proxy wall');
  console.log('Solution: Need Cloudflare API credentials or origin IP\n');

})();
