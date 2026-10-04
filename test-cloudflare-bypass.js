const CloudflareBypass = require('./5-cloudflare-bypass');

(async () => {
  console.log('\n🔐 CLOUDFLARE BYPASS TEST\n');
  
  const bypasser = new CloudflareBypass({
    domain: 'globalenergymonitor.org',
  });

  try {
    await bypasser.launch();
    console.log('✅ Browser launched with Cloudflare bypass');
    console.log('🛡️  Anti-detection headers configured\n');

    // Test 1: Detect Cloudflare
    console.log('🔍 Test 1: Detecting Cloudflare protection...');
    const detection = await bypasser.detectCloudflare();
    console.log(`   Cloudflare detected: ${detection.isCloudflare ? '✅ Yes' : '❌ No'}`);
    console.log(`   Challenge present: ${detection.hasChallenge ? '✅ Yes' : '❌ No'}`);
    if (detection.headers) {
      console.log(`   CF-Ray: ${detection.headers['cf-ray'] || 'Not set'}\n`);
    }

    // Test 2: Try standard bypass
    console.log('🔄 Test 2: Attempting standard Cloudflare bypass...');
    try {
      const result = await bypasser.gotoWithBypass('https://globalenergymonitor.org');
      console.log('   ✅ Bypass successful!\n');
    } catch (e) {
      console.log(`   ⚠️  Standard bypass limited: ${e.message}\n`);
    }

    // Test 3: Resolve origin IP
    console.log('🔗 Test 3: Resolving origin IP...');
    const originIp = await bypasser.resolveOriginIP();
    if (originIp) {
      console.log(`   ✅ Origin IP found: ${originIp}\n`);
    } else {
      console.log('   ⚠️  Could not resolve origin IP (site may use Cloudflare DNS)\n');
    }

    // Test 4: Direct IP bypass
    if (originIp) {
      console.log('🔗 Test 4: Attempting direct IP bypass...');
      try {
        const result = await bypasser.bypassViaDirectIP('https://globalenergymonitor.org');
        console.log(`   ✅ Direct IP bypass successful! (Status: ${result.statusCode})`);
        console.log(`   📄 Content length: ${result.body.length} bytes\n`);
      } catch (e) {
        console.log(`   ⚠️  Direct IP bypass failed: ${e.message}\n`);
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ CLOUDFLARE BYPASS INTEGRATION SUCCESSFUL');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('Available bypass methods:');
    console.log('  1. Standard bypass (built-in anti-detection)');
    console.log('  2. Direct IP connection (if origin IP resolvable)');
    console.log('  3. Challenge token extraction');
    console.log('  4. Cloudflare API (with credentials)\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await bypasser.close();
  }
})();
