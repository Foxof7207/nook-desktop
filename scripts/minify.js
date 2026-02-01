import fs from 'fs'
import path from 'path'
import { minify } from 'terser'

const filesToMinify = [
  'app/main/js/main.js',
  'app/hidden/player.js',
  'app/hidden/wad.js'
]

async function minifyFiles() {
  for (const file of filesToMinify) {
    if (!fs.existsSync(file)) continue
    
    const code = fs.readFileSync(file, 'utf8')
    const result = await minify(code, {
      compress: {
        passes: 2
      },
      mangle: true
    })
    
    if (result.error) {
      console.error(`Error minifying ${file}:`, result.error)
      continue
    }
    
    const minFile = file.replace('.js', '.min.js')
    fs.writeFileSync(minFile, result.code)
    
    const originalSize = Buffer.byteLength(code)
    const minifiedSize = Buffer.byteLength(result.code)
    const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1)
    
    console.log(`✓ ${file} → ${minFile} (${reduction}% reduction)`)
  }
}

minifyFiles().catch(console.error)
