#!/bin/bash
# Size Optimization Script - Run before final build

echo "🔍 Analyzing current size..."
echo "Original dist size: $(du -sh dist/ 2>/dev/null | cut -f1)"

# Clean old builds
rm -rf dist/

# Run minification
node scripts/minify.js

# Build
npm run dist

# Clean locales to reduce size by ~40%
node scripts/cleanup-locales.js

echo ""
echo "✅ Optimization complete!"
echo "📦 New dist size: $(du -sh dist/ 2>/dev/null | cut -f1)"
