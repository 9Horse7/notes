const{ contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('almocei', {
    almoco: () => ipcRenderer.invoke('almoco')
})