# ✅ Automatic Build Setup - Installation Checklist

## What's Been Set Up

- [x] **GitHub Actions Release Workflow** - Auto-builds on version tags
  - Builds for: macOS, Ubuntu, Windows (parallel)
  - Creates: .deb, .exe, .dmg packages
  - Uploads to GitHub Releases automatically

- [x] **GitHub Actions CI Workflow** - Tests and optional builds
  - Runs on: Push to main/develop, Pull requests
  - Includes: Linting, optional builds

- [x] **Build Configuration** - package.json electron-builder setup
  - Windows: NSIS installer + portable .exe
  - Linux: Debian .deb + AppImage
  - macOS: DMG with code signing

- [x] **Helper Scripts**
  - `scripts/build-all.js` - Local build helper
  - `scripts/setup-ci-secrets.js` - GitHub secrets guide

- [x] **Documentation**
  - BUILD_SETUP.md - Complete technical guide
  - QUICK_START_BUILD.md - Quick reference
  - SETUP_COMPLETE.md - Setup summary

## Before First Release - Setup Checklist

### Step 1: Commit Changes
```bash
git add .github/ scripts/ *.md package.json
git commit -m "feat: setup automatic cross-platform builds"
git push origin main
```
- [ ] Changes pushed to main

### Step 2: Configure GitHub Secrets (REQUIRED)
Go to: **Repository Settings → Secrets and variables → Actions**
- [ ] Add secret: `GH_TOKEN`
  - Value: Your GitHub Personal Access Token
  - Get token: https://github.com/settings/tokens
  - Select scope: `repo` (for releases)

### Step 3: (Optional) Code Signing Secrets
For signed Windows/macOS builds:
- [ ] Add `CSC_LINK` (Windows certificate base64)
- [ ] Add `CSC_KEY_PASSWORD` (Certificate password)
- [ ] Add `APPLEID` (Apple ID for macOS notarization)
- [ ] Add `APPLEIDPASS` (Apple password)

**Note:** These are optional. Builds will work without them (unsigned).

## First Release Test

### Create Release
```bash
# 1. Update version in package.json (e.g., 1.0.11)
# 2. Commit
git add package.json
git commit -m "bump: version to 1.0.11"
git push origin main

# 3. Create tag
git tag v1.0.11
git push origin v1.0.11
```
- [ ] Version tag pushed to GitHub

### Monitor Build
- [ ] Go to: Repository → **Actions** tab
- [ ] See **Release** workflow running
- [ ] Wait for all 3 platforms to complete (5-15 minutes)
- [ ] Check for any build errors

### Verify Release
- [ ] Go to: Repository → **Releases**
- [ ] See version 1.0.11 release created
- [ ] Verify files present:
  - [ ] `nook-1.0.11-x64.deb` (Linux)
  - [ ] `NookSetup-1.0.11.exe` (Windows installer)
  - [ ] `Nook-1.0.11-portable.exe` (Windows portable)
  - [ ] `NookSetup.dmg` (macOS)

## Usage Reference

### Regular Releases
```bash
# Update version in package.json
# Commit and push
git add package.json && git commit -m "bump: version" && git push

# Create release tag
git tag vX.Y.Z
git push origin vX.Y.Z

# Watch at: Repository → Actions
# Download from: Repository → Releases
```

### Local Testing
```bash
# Test build on current platform
npm run build

# Check artifacts
ls -la dist/
```

### View Build Status
- GitHub → Repository → **Actions** tab
- Watch the "Release" workflow
- See build output and errors

## Files Modified/Created

### GitHub Actions Workflows
- `.github/workflows/release.yml` - Enhanced
- `.github/workflows/main.yml` - Enhanced

### Build Configuration
- `package.json` - Updated build targets

### Helper Scripts
- `scripts/build-all.js` - Local build helper
- `scripts/setup-ci-secrets.js` - Secrets setup guide

### Documentation
- `BUILD_SETUP.md` - Complete technical documentation
- `QUICK_START_BUILD.md` - Quick reference guide
- `SETUP_COMPLETE.md` - Setup completion summary
- `BUILD_CHECKLIST.md` - This file

## Troubleshooting

### Build fails on Windows
```bash
npm install windows-build-tools -g
npm run build
```

### Build fails on macOS
- Ensure Xcode command line tools installed
- For code signing: verify certificate in Keychain

### Build fails on Linux
```bash
sudo apt-get install build-essential libxss1 libgconf-2-4
npm run build
```

### Workflow not running
- Check: Repository → Actions → Release workflow is enabled
- Check: You pushed a tag starting with "v" (e.g., v1.0.11)
- Check: GH_TOKEN secret is configured

## Documentation Links

- **Complete Guide:** See [BUILD_SETUP.md](BUILD_SETUP.md)
- **Quick Start:** See [QUICK_START_BUILD.md](QUICK_START_BUILD.md)
- **Setup Summary:** See [SETUP_COMPLETE.md](SETUP_COMPLETE.md)

## Help Commands

```bash
# Setup secrets guide
node scripts/setup-ci-secrets.js

# Local build
npm run build

# View lint errors
npm run lint
```

## Success Criteria

✅ After completing this checklist:
- Automatic builds trigger on version tags
- .deb and .exe packages created automatically
- Artifacts uploaded to GitHub Releases
- Minimal manual intervention needed

---

**Status:** Ready to use! Follow the "First Release Test" section to verify.
