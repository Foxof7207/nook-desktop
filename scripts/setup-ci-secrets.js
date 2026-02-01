#!/usr/bin/env node

/**
 * Helper script to guide users through setting up GitHub Actions secrets
 * Run: node scripts/setup-ci-secrets.js
 */

import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve))

async function main() {
  console.log('\n🔐 Nook Desktop - GitHub Actions Setup Helper\n')
  console.log('This script will guide you through setting up GitHub Actions secrets.\n')

  console.log('📝 Required Steps:\n')
  console.log('1. Go to your GitHub repository')
  console.log('2. Navigate to: Settings → Secrets and variables → Actions')
  console.log('3. Click "New repository secret"\n')

  const secrets = [
    {
      name: 'GH_TOKEN',
      description: 'GitHub Personal Access Token',
      instructions: [
        'Go to: https://github.com/settings/tokens',
        'Click "Generate new token (classic)"',
        'Select scopes: repo, read:org',
        'Copy the token'
      ],
      optional: false
    },
    {
      name: 'CSC_LINK',
      description: 'Code Signing Certificate (Windows/macOS)',
      instructions: [
        'This is a path to your code signing certificate file',
        'For CI/CD, base64 encode the certificate: cat cert.p12 | base64',
        'Copy the base64 string'
      ],
      optional: true
    },
    {
      name: 'CSC_KEY_PASSWORD',
      description: 'Certificate Password',
      instructions: ['Your code signing certificate password'],
      optional: true
    },
    {
      name: 'APPLEID',
      description: 'Apple ID (for macOS notarization)',
      instructions: ['Your Apple ID email'],
      optional: true
    },
    {
      name: 'APPLEIDPASS',
      description: 'Apple ID Password (or app-specific password)',
      instructions: ['Your Apple ID password or app-specific password'],
      optional: true
    }
  ]

  console.log('📋 Secrets to Configure:\n')

  for (const secret of secrets) {
    const optional = secret.optional ? ' [OPTIONAL]' : ''
    console.log(`${secret.name}${optional}`)
    console.log(`  Description: ${secret.description}`)
    console.log(`  How to get it:`)
    secret.instructions.forEach((instr) => console.log(`    • ${instr}`))
    console.log()
  }

  console.log('\n✅ Quick Setup Steps:\n')
  console.log('1. Create GH_TOKEN:')
  console.log('   https://github.com/settings/tokens/new')
  console.log()
  console.log('2. Add each secret in: Settings → Secrets and variables → Actions')
  console.log()
  console.log('3. For Windows builds (optional):')
  console.log('   • Obtain a code signing certificate')
  console.log('   • Export as .p12 file')
  console.log('   • Base64 encode it and add as CSC_LINK')
  console.log()
  console.log('4. For macOS builds (optional):')
  console.log('   • Add APPLEID and APPLEIDPASS for notarization')
  console.log()

  console.log('\n🚀 After Setup:\n')
  console.log('1. Tag a release: git tag v1.0.11')
  console.log('2. Push the tag: git push origin v1.0.11')
  console.log('3. GitHub Actions will automatically build and release')
  console.log('4. Artifacts will appear in: Releases section\n')

  rl.close()
}

main().catch(console.error)
