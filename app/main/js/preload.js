const { ipcRenderer } = require('electron')

window.electronAPI = {
  send: (channel, data) => {
    const validChannels = ['toPlayer', 'min', 'close', 'patreon', 'github', 'clearSettings', 'openOnStartup']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    const validChannels = ['toWindow']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
}
