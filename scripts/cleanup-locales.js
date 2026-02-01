/**
 * Remove unused Electron locales to reduce package size
 * Run after build to reduce final package sizes
 */
import fs from 'fs'
import path from 'path'

const dirs = ['dist/linux-unpacked', 'dist/win-unpacked']
const localeDir = 'locales'

// Keep only essential locales (reduces size by ~40%)
const keepLocales = [
  'en-US.pak',
  'en-GB.pak'
]

dirs.forEach(dir => {
  const locPath = path.join(dir, localeDir)
  if (!fs.existsSync(locPath)) return

  fs.readdirSync(locPath).forEach(file => {
    if (!keepLocales.includes(file)) {
      const filePath = path.join(locPath, file)
      const size = (fs.statSync(filePath).size / 1024 / 1024).toFixed(2)
      fs.unlinkSync(filePath)
      console.log(`✓ Removed ${file} (${size} MB)`)
    }
  })
})

console.log('Locale cleanup complete!')
