#!/usr/bin/env node
/**
 * Practical Examples — Real-world usage patterns for the toolkit
 */

const {
  HeadlessChromiumTester,
  PuppeteerStealthScraper,
  PrivacyHardenedBrowser,
  AdvancedAntiDetection,
} = require('./index');

// ===== Example 1: Daily Site Health Check =====
async function dailyHealthCheck(url) {
  console.log(`🏥 Running daily health check for ${url}...`);

  const tester = new HeadlessChromiumTester();
  const result = await tester.testPage(url, {
    isResponsive: `doc.querySelector('meta[name="viewport"]') !== null`,
    hasTitle: `doc.title.length > 0`,
    hasH1: `doc.querySelectorAll('h1').length > 0`,
    noConsoleErrors: `!results.html.includes('console.error')`,
  });

  console.log('Status:', result.success ? '✅ Healthy' : '❌ Failed');
  console.log('Title:', result.data.title);
  console.log('Responsive:', result.data.isResponsive);
  console.log('H1 Count:', result.data.h1Count);

  return result;
}

// ===== Example 2: Performance & Security Audit =====
async function performanceSecurityAudit(url) {
  console.log(`⚡ Running performance & security audit for ${url}...`);

  const scraper = new PuppeteerStealthScraper({
    headless: true,
    slowMo: 50,
  });

  await scraper.launch();
  const audit = await scraper.audit(url);
  await scraper.close();

  console.log('\n📊 Performance:');
  console.log(`  DNS: ${audit.performance.timing.dns}ms`);
  console.log(`  TTFB: ${audit.performance.timing.ttfb}ms`);
  console.log(`  Total Load: ${audit.performance.timing.loadComplete}ms`);

  console.log('\n🔒 Security Headers:');
  Object.entries(audit.security.headers).forEach(([header, value]) => {
    const status = value ? '✅' : '❌';
    console.log(`  ${status} ${header}: ${value || 'Missing'}`);
  });

  console.log('\n🎯 SEO:');
  console.log(`  Title: ${audit.seo.title}`);
  console.log(`  Meta Description: ${audit.seo.metaDescription ? '✅' : '❌'}`);
  console.log(`  H1 Count: ${audit.seo.h1Count}`);
  console.log(`  Canonical URL: ${audit.seo.canonicalUrl ? '✅' : '❌'}`);

  console.log('\n♿ Accessibility:');
  console.log(`  Images without alt: ${audit.accessibility.imagesWithoutAlt}`);
  console.log(`  Forms without labels: ${audit.accessibility.formsWithoutLabels}`);

  return audit;
}

// ===== Example 3: Privacy & Tracker Audit =====
async function privacyAudit(url) {
  console.log(`🔐 Running privacy audit for ${url}...`);

  const browser = new PrivacyHardenedBrowser();
  await browser.launch();

  // Check fingerprint
  const fingerprint = await browser.auditFingerprint(url);
  console.log('\n🕵️ Browser Fingerprint:');
  console.log(`  User Agent: ${fingerprint.fingerprint.navigator.userAgent.substring(0, 50)}...`);
  console.log(`  Platform: ${fingerprint.fingerprint.navigator.platform}`);
  console.log(`  Language: ${fingerprint.fingerprint.navigator.language}`);
  console.log(`  Screen: ${fingerprint.fingerprint.screen.width}x${fingerprint.fingerprint.screen.height}`);
  console.log(`  WebDriver: ${fingerprint.fingerprint.navigator.webdriver ? '❌ Detected' : '✅ Hidden'}`);

  // Check trackers
  const trackers = await browser.detectTrackers(url);
  console.log(`\n📍 Trackers Detected: ${trackers.trackersDetected}`);
  if (trackers.trackers.length > 0) {
    console.log('  Detected:');
    trackers.trackers.forEach(t => {
      console.log(`    - ${t.type} (${t.statusCode})`);
    });
  }

  await browser.close();
  return { fingerprint, trackers };
}

// ===== Example 4: Bot Detection Testing =====
async function botDetectionAudit(url) {
  console.log(`🤖 Auditing bot detection systems for ${url}...`);

  const detector = new AdvancedAntiDetection();
  await detector.launch();

  const result = await detector.auditBotDetection(url);

  console.log('\n🚨 Detection Vectors Found:');
  if (result.detectionVectors.detectedVectors.length > 0) {
    result.detectionVectors.detectedVectors.forEach(v => {
      console.log(`  - ${v}`);
    });
  } else {
    console.log('  None detected ✅');
  }

  console.log('\n⚠️ Vulnerabilities:');
  if (result.detectionVectors.vulnerabilities.length > 0) {
    result.detectionVectors.vulnerabilities.forEach(v => {
      console.log(`  - ${v}`);
    });
  } else {
    console.log('  None found ✅');
  }

  console.log('\n💡 Recommendations:');
  result.recommendations.forEach(r => {
    console.log(`  - ${r}`);
  });

  await detector.close();
  return result;
}

// ===== Example 5: Comprehensive Multi-Audit =====
async function comprehensiveAudit(url) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 COMPREHENSIVE AUDIT: ${url}`);
  console.log(`${'='.repeat(60)}\n`);

  const results = {};

  try {
    console.log('1️⃣ Running health check...');
    results.health = await dailyHealthCheck(url);
  } catch (e) {
    console.error('Health check failed:', e.message);
  }

  try {
    console.log('\n2️⃣ Running performance & security audit...');
    results.performance = await performanceSecurityAudit(url);
  } catch (e) {
    console.error('Performance audit failed:', e.message);
  }

  try {
    console.log('\n3️⃣ Running privacy audit...');
    results.privacy = await privacyAudit(url);
  } catch (e) {
    console.error('Privacy audit failed:', e.message);
  }

  try {
    console.log('\n4️⃣ Auditing bot detection...');
    results.botDetection = await botDetectionAudit(url);
  } catch (e) {
    console.error('Bot detection audit failed:', e.message);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Audit complete');
  console.log(`${'='.repeat(60)}\n`);

  return results;
}

// ===== Example 6: Custom Scraper with Analysis =====
async function scrapeAndAnalyze(url) {
  console.log(`📄 Scraping and analyzing ${url}...`);

  const scraper = new PuppeteerStealthScraper({
    headless: true,
    slowMo: 100,
  });

  await scraper.launch();

  const result = await scraper.scrape(url, () => {
    // Custom extraction logic
    const links = Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.textContent,
      href: a.href,
      target: a.target,
    }));

    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      loading: img.loading,
    }));

    const forms = Array.from(document.querySelectorAll('form')).map(form => ({
      id: form.id,
      method: form.method,
      action: form.action,
      fields: Array.from(form.querySelectorAll('input, textarea, select')).map(f => ({
        name: f.name,
        type: f.type,
        required: f.required,
      })),
    }));

    return { links, images, forms };
  });

  console.log('\n📊 Analysis:');
  console.log(`  Total Links: ${result.data.links.length}`);
  console.log(`  External Links: ${result.data.links.filter(l => l.href.includes('http')).length}`);
  console.log(`  Images: ${result.data.images.length}`);
  console.log(`  Forms: ${result.data.forms.length}`);

  await scraper.close();
  return result;
}

// ===== CLI Runner =====
async function main() {
  const url = process.argv[2] || 'https://example.com';
  const mode = process.argv[3] || 'comprehensive';

  const modes = {
    health: dailyHealthCheck,
    performance: performanceSecurityAudit,
    privacy: privacyAudit,
    botdetection: botDetectionAudit,
    scrape: scrapeAndAnalyze,
    comprehensive: comprehensiveAudit,
  };

  const fn = modes[mode];
  if (!fn) {
    console.error(`Unknown mode: ${mode}`);
    console.error(`Available modes: ${Object.keys(modes).join(', ')}`);
    process.exit(1);
  }

  try {
    const result = await fn(url);
    console.log('\n📊 Full Result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  dailyHealthCheck,
  performanceSecurityAudit,
  privacyAudit,
  botDetectionAudit,
  comprehensiveAudit,
  scrapeAndAnalyze,
};
