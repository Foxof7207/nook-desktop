const {
  app,
  BrowserWindow,
  Tray,
  nativeImage,
  Menu,
  ipcMain,
  shell,
  powerMonitor
} = require('electron')

const os = require('os')
const storage = require('electron-json-storage')
const path = require('path')
const fs = require('fs')

const userSettingsPath = path.join(app.getPath('userData'), 'userSettings') // change path for userSettings
storage.setDataPath(userSettingsPath)
const assets = app.isPackaged
  ? path.join(process.resourcesPath, '/build/icons/')
  : path.join(__dirname, '/build/icons/')



const progress = (win, num) => {
  win.webContents.send('toWindow', ['bar', num])
}

let myWindow
let tray
let playing = 'Nook - playing nothing!'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 500,
    autoHideMenuBar: true,
    transparent: true,
    frame: false,
    resizable: false,
    movable: true,
    hasShadow: true,
    icon: path.join(assets, 'nook.png'),
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      preload: path.join(__dirname, 'app/main/js/preload.js')
    }
  })

  // Center window on screen
  win.center()

  console.log('Main window created, loading index.html...')
  win.loadFile(path.join(__dirname, './app/main/index.html'))

  const createTray = () => {
    if (tray) return

    const macTrayImage = 'nookTemplate.png'
    const trayImage = 'nookTray.png'
    const trayIconPath = os.platform() === 'darwin'
      ? path.join(assets, macTrayImage)
      : path.join(assets, trayImage)

    const trayIcon = nativeImage.createFromPath(trayIconPath)
    tray = new Tray(trayIcon)

    const trayMenu = Menu.buildFromTemplate([
      { label: 'Show Nook', click: show },
      { type: 'separator' },
      { label: 'Exit', click: exit }
    ])

    tray.setToolTip(playing)
    tray.setContextMenu(trayMenu)
    tray.on('click', show)
  }

  const show = () => {
    if (win.isMinimized()) win.restore()
    win.show()
    win.focus()
    win.setSkipTaskbar(false)
    if (app.dock) app.dock.show()
  }

  const exit = () => {
    if (tray) tray.destroy()
    app.exit()
  }

  const close = (event) => {
    if (event) event.preventDefault()

    createTray()

    win.setSkipTaskbar(true)
    win.hide()
    if (app.dock) app.dock.hide()
  }

  ipcMain.addListener('patreon', () => {
    shell.openExternal('https://www.patreon.com/mattu')
  })
  ipcMain.addListener('github', () => {
    shell.openExternal('https://nook.camp')
  })

  ipcMain.addListener('min', close)
  ipcMain.addListener('close', exit)

  win.on('close', exit)

  const hiddenWin = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      preload: path.join(__dirname, 'app/hidden/player-preload.js')
    },
    skipTaskbar: false,
    excludedFromShownWindowsMenu: true,
    focusable: false
  })
  hiddenWin.setSkipTaskbar(true)
  console.log('Hidden player window created, loading hidden index.html...')
  hiddenWin.loadFile(path.join(__dirname, './app/hidden/index.html'))

  powerMonitor.addListener('suspend', () => {
    hiddenWin.webContents.send('toPlayer', ['pauseIfPlaying'])
  })

  ipcMain.on('playerLoaded', () => {
    console.log('Player loaded, sending settings...')
    hiddenWin.webContents.send('toPlayer', [
      'userSettingsPath',
      userSettingsPath,
      app.getVersion()
    ])
  })

  ipcMain.on('openOnStartup', (event, args) => {
    app.setLoginItemSettings({
      openAtLogin: args[0]
    })
  })

  ipcMain.on('toPlayer', (event, args) => {
    console.log('Forwarding toPlayer:', args[0])
    hiddenWin.webContents.send('toPlayer', args)
  })

  ipcMain.on('toWindow', (_event, args) => {
    console.log('Forwarding toWindow:', args[0])
    win.webContents.send('toWindow', args)
  })

  ipcMain.addListener('clearSettings', async (_event) => {
    progress(win, 1)
    await new Promise((resolve) => storage.clear((err) => resolve(err)))
    progress(win, 50)
    await new Promise((resolve) =>
      fs.rm(
        userSettingsPath + '/sound',
        { recursive: true, force: true },
        (err) => resolve(err)
      )
    )
    progress(win, 100)

    app.relaunch()
    app.exit()
  })

  ipcMain.on('playing', (event, args) => {
    if (args[0]) playing = `Nook - playing ${args[0]} (${args[1]})!`
    else playing = 'Nook - playing nothing!'
    if (tray && !tray.isDestroyed()) tray.setToolTip(playing)
  })

  return win
}

// app.disableHardwareAcceleration()

if (process.platform === 'win32') {
  app.setAppUserModelId(app.name)
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) app.quit()
else {
  app.on('second-instance', (_event, _commandLine, _workingDirectory, _additionalData) => {
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore()
      myWindow.focus()
    }
  })

  app.whenReady().then(() => {
    myWindow = createWindow()
  })
}


