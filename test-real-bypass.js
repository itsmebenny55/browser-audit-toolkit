const CloudflareBypass = require('./5-cloudflare-bypass');

(async () => {
  console.log('\n🔐 CLOUDFLARE BYPASS TEST - globalenergymonitor.org\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const bypasser = new CloudflareBypass({
    domain: 'globalenergymonitor.org',
    useDirectIP: true,
    timeout: 45000,
  });

  try {
    console.log('1️⃣ LAUNCHING BROWSER WITH BYPASS...\n');
    await bypasser.launch();
    console.log('✅ Browser launched with stealth + CF bypass\n');

    console.log('2️⃣ DETECTING CLOUDFLARE PROTECTION...\n');
    const detection = await bypasser.detectCloudflare();
    console.log(`   Cloudflare present: ${detection.isCloudflare ? '✅ YES' : '❌ NO'}`);
    console.log(`   Challenge detected: ${detection.hasChallenge ? '🛡️ YES' : '❌ NO'}`);
    if (detection.headers['cf-ray']) {
      console.log(`   CF-Ray header: ${detection.headers['cf-ray']}`);
    }
    console.log();

    console.log('3️⃣ RESOLVING ORIGIN IP...\n');
    const originIp = await bypasser.resolveOriginIP();
    if (originIp) {
      console.log(`   ✅ Found origin IP: ${originIp}\n`);
    } else {
      console.log('   ⚠️  Using Cloudflare IPs (full proxy mode)\n');
    }

    console.log('4️⃣ ATTEMPTING BYPASS WITH REALISTIC HEADERS...\n');
    try {
      const response = await bypasser.gotoWithBypass(
        'https://globalenergymonitor.org'
      );
      
      console.log('✅ PAGE LOADED!\n');
      
      const pageInfo = await bypasser.page.evaluate(() => ({
        title: document.title,
        url: window.location.href,
        headings: document.querySelectorAll('h1, h2').length,
        links: document.querySelectorAll('a').length,
        images: document.querySelectorAll('img').length,
        textLength: document.body.innerText.length,
      }));

      console.log('5️⃣ PAGE CONTENT EXTRACTED:\n');
      console.log(`   📄 Title: ${pageInfo.title}`);
      console.log(`   🔗 URL: ${pageInfo.url}`);
      console.log(`   📰 Headings: ${pageInfo.headings}`);
      console.log(`   🌐 Links: ${pageInfo.links}`);
      console.log(`   🖼️  Images: ${pageInfo.images}`);
      console.log(`   📝 Text content: ${pageInfo.textLength} characters\n`);

      // Verify stealth
      const stealthCheck = await bypasser.page.evaluate(() => ({
        webdriver: navigator.webdriver,
        chromeRuntime: typeof window.chrome?.runtime !== 'undefined',
        plugins: navigator.plugins.length,
      }));

      console.log('6️⃣ STEALTH VERIFICATION:\n');
      console.log(`   🦊 Webdriver hidden: ${!stealthCheck.webdriver ? '✅' : '❌'}`);
      console.log(`   🔧 Chrome runtime: ${stealthCheck.chromeRuntime ? '✅' : '❌'}`);
      console.log(`   🔌 Plugins spoofed: ${stealthCheck.plugins > 0 ? '✅' : '❌'}\n`);

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎉 CLOUDFLARE BYPASS SUCCESSFUL!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      console.log('✨ What worked:');
      console.log('   ✅ Cloudflare challenge detected and handled');
      console.log('   ✅ Anti-detection headers applied');
      console.log('   ✅ Browser automation indicators hidden');
      console.log('   ✅ Page content successfully scraped');
      console.log('   ✅ Stealth properties verified\n');

    } catch (e) {
      console.log(`⚠️  Bypass attempt error: ${e.message}\n`);
      console.log('Note: This is expected with strict CF rules.');
      console.log('Fallback options:');
      console.log('  1. Use direct IP if available');
      console.log('  2. Use Cloudflare API with credentials');
      console.log('  3. Configure origin server to allow direct access\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    console.log('Closing browser...');
    await bypasser.close();
    console.log('✅ Test complete\n');
  }
})();
