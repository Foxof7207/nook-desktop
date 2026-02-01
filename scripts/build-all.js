#!/usr/bin/env node

/**
 * Build script to create distribution packages for all platforms
 * Usage: node scripts/build-all.js
 */

import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

const platform = os.platform()

console.log('🔨 Nook Desktop Build Script')
console.log(`📦 Current Platform: ${platform}`)
console.log('━'.repeat(50))

try {
  // Step 1: Minify
  console.log('\n📝 Step 1: Minifying assets...')
  execSync('npm run minify', { cwd: projectRoot, stdio: 'inherit' })

  // Step 2: Build
  console.log('\n🏗️  Step 2: Building distributables...')
  execSync('npm run dist', { cwd: projectRoot, stdio: 'inherit' })

  console.log('\n✅ Build completed successfully!')
  console.log('📂 Artifacts can be found in the "dist/" directory')

  if (platform === 'linux') {
    console.log('\n📦 Linux builds created:')
    console.log('   - .deb package (for Debian/Ubuntu)')
    console.log('   - AppImage (portable)')
  } else if (platform === 'win32') {
    console.log('\n📦 Windows builds created:')
    console.log('   - NookSetup-*.exe (NSIS installer)')
    console.log('   - Nook-*-portable.exe (Portable executable)')
  } else if (platform === 'darwin') {
    console.log('\n📦 macOS builds created:')
    console.log('   - NookSetup.dmg (DMG installer)')
  }
} catch (error) {
  console.error('\n❌ Build failed!')
  console.error(error.message)
  process.exit(1)
}
