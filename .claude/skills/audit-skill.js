#!/usr/bin/env node
/**
 * Browser Audit Toolkit Skill for Claude Code
 *
 * Usage:
 *   /audit-performance URL
 *   /audit-privacy URL
 *   /audit-anti-detection URL
 *   /bypass-cloudflare URL
 *   /detect-cloudflare URL
 *   /audit-comprehensive URL
 *   /toolkit-verify
 *   /toolkit-restore
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const TOOLKIT_ROOT = path.dirname(path.dirname(__dirname));

class AuditSkill {
  constructor() {
    this.commands = {
      'audit-performance': this.auditPerformance.bind(this),
      'audit-privacy': this.auditPrivacy.bind(this),
      'audit-anti-detection': this.auditAntiDetection.bind(this),
      'bypass-cloudflare': this.bypassCloudflare.bind(this),
      'detect-cloudflare': this.detectCloudflare.bind(this),
      'audit-comprehensive': this.auditComprehensive.bind(this),
      'toolkit-verify': this.toolkitVerify.bind(this),
      'toolkit-restore': this.toolkitRestore.bind(this),
    };
  }

  run(command, args) {
    const [cmd, ...rest] = command.split(' ').filter(Boolean);
    const handler = this.commands[cmd];

    if (!handler) {
      console.error(`❌ Unknown command: ${cmd}`);
      console.error('Available commands:');
      Object.keys(this.commands).forEach(c => console.error(`  - /${c}`));
      process.exit(1);
    }

    try {
      handler(...rest);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  }

  async auditPerformance(url) {
    if (!url) {
      console.error('❌ Usage: /audit-performance URL');
      process.exit(1);
    }

    console.log(`\n📊 Performance Audit: ${url}\n`);
    this.runCommand(`npm run audit:performance -- ${url}`);
  }

  async auditPrivacy(url) {
    if (!url) {
      console.error('❌ Usage: /audit-privacy URL');
      process.exit(1);
    }

    console.log(`\n🔐 Privacy Audit: ${url}\n`);
    this.runCommand(`npm run audit:privacy -- ${url}`);
  }

  async auditAntiDetection(url) {
    if (!url) {
      console.error('❌ Usage: /audit-anti-detection URL');
      process.exit(1);
    }

    console.log(`\n🤖 Anti-Detection Test: ${url}\n`);
    this.runCommand(`npm run audit:anti-detection -- ${url}`);
  }

  async bypassCloudflare(url) {
    if (!url) {
      console.error('❌ Usage: /bypass-cloudflare URL');
      process.exit(1);
    }

    console.log(`\n🔓 Cloudflare Bypass Attempt: ${url}\n`);
    console.log('⚠️  Authorized testing only\n');
    this.runCommand(`npm run bypass:cloudflare -- ${url}`);
  }

  async detectCloudflare(url) {
    if (!url) {
      console.error('❌ Usage: /detect-cloudflare URL');
      process.exit(1);
    }

    console.log(`\n🛡️  Cloudflare Detection: ${url}\n`);
    this.runCommand(`npm run detect:cloudflare -- ${url}`);
  }

  async auditComprehensive(url) {
    if (!url) {
      console.error('❌ Usage: /audit-comprehensive URL');
      process.exit(1);
    }

    console.log(`\n🔍 Comprehensive Audit: ${url}\n`);
    console.log('Running all 5 strategies...\n');
    this.runCommand(`node examples.js ${url} comprehensive`);
  }

  async toolkitVerify() {
    console.log('\n🔍 Verifying Toolkit\n');
    this.runCommand('npm run verify');
  }

  async toolkitRestore() {
    console.log('\n🚀 Restoring Toolkit\n');
    this.runCommand('npm run restore');
  }

  runCommand(cmd) {
    try {
      const output = execSync(cmd, {
        cwd: TOOLKIT_ROOT,
        stdio: 'inherit',
        encoding: 'utf-8',
      });
      return output;
    } catch (error) {
      throw error;
    }
  }
}

// Main entry point
if (require.main === module) {
  const skill = new AuditSkill();
  const args = process.argv.slice(2);
  const command = args.join(' ');

  if (!command) {
    console.error('❌ No command provided');
    console.error('Usage: audit-skill.js <command> [args]');
    process.exit(1);
  }

  skill.run(command, args);
}

module.exports = AuditSkill;
