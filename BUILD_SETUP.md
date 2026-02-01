# Automatic Build Setup for Nook Desktop

This document describes the automated build system for Nook Desktop that creates distributable packages for Windows (.exe), Linux (.deb), and macOS (.dmg).

## Overview

The build system uses:
- **GitHub Actions** for CI/CD automation
- **Electron Builder** for cross-platform packaging
- **npm scripts** for local builds

## Build Artifacts

### Windows
- **NookSetup-{version}.exe** - NSIS Installer (recommended for most users)
- **Nook-{version}-portable.exe** - Portable executable (no installation required)

### Linux
- **nook-{version}-x64.deb** - Debian/Ubuntu package
- **nook-{version}-x64.AppImage** - Portable AppImage

### macOS
- **NookSetup.dmg** - DMG installer package

## GitHub Actions Workflows

### 1. Release Workflow (`.github/workflows/release.yml`)

**Triggers:** On push of version tags (e.g., `v1.0.10`)

**What it does:**
- Builds on all three platforms (macOS, Ubuntu, Windows)
- Runs linting
- Creates distributable packages
- Uploads artifacts to GitHub Release

**To trigger:**
```bash
git tag v1.0.10
git push origin v1.0.10
```

### 2. Main CI Workflow (`.github/workflows/main.yml`)

**Triggers:** 
- Push to `main` or `develop` branches
- Pull requests to `main`
- Manual workflow dispatch (Actions → Node.js CI → Run workflow)

**What it does:**
- Linting checks on Ubuntu
- Optional build artifacts (on manual dispatch)
- Uploads build artifacts for 7 days

## Local Development

### Build for Current Platform

```bash
# Minify and build with all configurations
npm run release

# Or just pack without release
npm run pack

# Quick minify-only
npm run minify
```

### Using the Build Script

```bash
node scripts/build-all.js
```

This script:
1. Minifies assets
2. Creates platform-specific packages
3. Outputs to `dist/` directory

## Environment Configuration

Create a `.env` file in the project root for release builds:

```bash
# GitHub token (for releases)
GH_TOKEN=your_github_token

# Windows Code Signing (optional)
CSC_LINK=path_to_certificate
CSC_KEY_PASSWORD=certificate_password

# macOS Code Signing (optional)
CSC_LINK=path_to_certificate
CSC_KEY_PASSWORD=certificate_password
CSC_NAME=certificate_name
APPLEID=your_apple_id
APPLEIDPASS=your_apple_password
```

**To use secrets in GitHub Actions:**

1. Go to repository Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `CSC_LINK` - Code signing certificate file (base64 encoded for Windows)
   - `CSC_KEY_PASSWORD` - Certificate password
   - `APPLEID` - Apple ID (for macOS notarization)
   - `APPLEIDPASS` - Apple ID password

## Build Configuration Details

### Linux (.deb)

Configuration in `package.json`:
```json
"linux": {
  "target": ["deb", "AppImage"],
  "category": "Audio",
  "icon": "build/icons",
  "maintainer": "Foxof7207"
}
```

Creates:
- **Debian package** - installable via `apt install`
- **AppImage** - portable, no dependencies needed

### Windows (.exe)

Configuration in `package.json`:
```json
"win": {
  "target": [
    { "target": "nsis", "arch": ["x64"] },
    { "target": "portable", "arch": ["x64"] }
  ]
}
```

Creates:
- **NSIS Installer** - traditional Windows setup wizard
- **Portable version** - single executable, no installation

### macOS (.dmg)

Configuration in `package.json`:
```json
"mac": {
  "target": ["dmg"]
}
```

With code signing and notarization support.

## Automated Build Process

### Release Workflow Steps

```
1. Checkout code
   ↓
2. Setup Node.js 20
   ↓
3. Install npm dependencies (npm ci)
   ↓
4. Run linter (npm run lint)
   ↓
5. Build and release (npm run release)
   ├─ Minify assets
   ├─ Run electron-builder
   └─ Create platform-specific packages
   ↓
6. Upload artifacts to GitHub Release
```

## Troubleshooting

### Build fails on Windows

**Issue:** `Could not find the path to vcbuild.exe`

**Solution:**
```bash
npm install windows-build-tools -g
```

### Build fails on Linux

**Issue:** Missing dependencies

**Solution:**
```bash
# Install required packages
sudo apt-get install build-essential libxss1 libgconf-2-4
```

### Build fails on macOS

**Issue:** Code signing certificate not found

**Solution:** Set up certificate in Keychain or use the `CSC_LINK` environment variable.

## Package Installation

### Install .deb (Linux)
```bash
sudo dpkg -i nook-*.deb
# Or
sudo apt install ./nook-*.deb
```

### Install .exe (Windows)
- Double-click the `.exe` installer
- Or run: `NookSetup-*.exe`

### Install .dmg (macOS)
- Double-click the `.dmg` file
- Drag Nook to Applications folder

## Version Management

Update the version in `package.json`:

```json
{
  "version": "1.0.11"
}
```

Then create a release tag:

```bash
git tag v1.0.11
git push origin v1.0.11
```

The GitHub Actions workflow will automatically create builds and a release.

## CI/CD Status

View build status:
- GitHub Actions: Navigate to **Actions** tab in the repository
- Look for the **Release** or **Node.js CI** workflows

## Additional Notes

- Builds are cached to improve speed
- All platforms build in parallel on GitHub Actions
- Artifacts are stored for 7 days on GitHub Actions
- Release builds upload directly to GitHub Releases

For more information on electron-builder, see: https://www.electron.build/
