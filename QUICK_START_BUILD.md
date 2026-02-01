# 🚀 Quick Start: Automatic Builds for Nook Desktop

## For Users - Getting Releases

Just tag a release on GitHub and automated builds happen automatically!

```bash
# 1. Update version in package.json (e.g., "1.0.11")
# 2. Create and push a version tag
git tag v1.0.11
git push origin v1.0.11

# 3. Wait for GitHub Actions to complete
# 4. Visit: https://github.com/YOUR_USERNAME/nook-desktop/releases
```

The workflow automatically creates:
- ✅ `.deb` for Linux (Debian/Ubuntu)
- ✅ `.exe` for Windows (installer + portable)
- ✅ `.dmg` for macOS

---

## For Developers - Local Builds

### One-time Setup

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Set up environment for code signing
cp .env.example .env
# Edit .env and add your secrets if you want to sign builds
```

### Build Commands

```bash
# Build for current platform with full release config
npm run release

# Build just the assets (minify)
npm run minify

# Use the helper script
npm run build
```

**Output:** Check `dist/` folder for your platform's packages

---

## GitHub Actions Setup (One-time)

### Minimal Setup (Recommended)

1. Go to: Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add: `GH_TOKEN` = Your GitHub Personal Access Token
   - Get one: https://github.com/settings/tokens
   - Scopes needed: `repo`

### Full Setup (Optional - for code signing)

```
GH_TOKEN          = Your GitHub token
CSC_LINK          = Code signing certificate (base64 encoded)
CSC_KEY_PASSWORD  = Certificate password
APPLEID           = Your Apple ID (for macOS)
APPLEIDPASS       = Apple ID password or app-specific password
```

Run the setup helper:
```bash
node scripts/setup-ci-secrets.js
```

---

## Build Artifacts

### Windows
- **NookSetup-1.0.11.exe** - Traditional installer (recommended)
- **Nook-1.0.11-portable.exe** - No installation needed

### Linux
- **nook-1.0.11-x64.deb** - Ubuntu/Debian package
- **nook-1.0.11-x64.AppImage** - Portable Linux executable

### macOS
- **NookSetup.dmg** - DMG installer with code signature + notarization

---

## Workflows Explained

| Workflow | Trigger | Output |
|----------|---------|--------|
| **Release** | Push version tag `v*` | Auto-builds all 3 platforms, creates GitHub Release |
| **CI** | Push to main/develop, PR | Optional build artifacts (7-day retention) |

---

## Common Commands

```bash
# View build status
# GitHub → Actions tab

# Check local build output
ls -la dist/

# Create release draft (review before publishing)
git tag -l

# Verify package contents (Linux)
dpkg -c nook-1.0.11-x64.deb
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Build failed on Windows" | Run: `npm install windows-build-tools -g` |
| "Missing linter errors" | Run: `npm run lint` locally first |
| "Workflow not running" | Check: Actions → View all workflows → Enable workflow |
| ".exe not generated" | Ensure you're on Windows or use CI/CD for builds |

---

## File Locations

```
.github/workflows/
├── release.yml     ← Auto-runs on version tags
└── main.yml        ← Runs on push/PR

scripts/
├── build-all.js    ← Local build helper
└── setup-ci-secrets.js ← GitHub secrets guide

BUILD_SETUP.md      ← Detailed documentation
```

---

## Next Steps

✅ Commit and push these changes
✅ Set up GitHub secrets (GH_TOKEN minimum)
✅ Tag a release: `git tag v1.0.11 && git push origin v1.0.11`
✅ Monitor: Repository → Actions tab
✅ Download: Repository → Releases

That's it! 🎉
