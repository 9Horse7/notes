const {app, BrowserWindow, ipcMain } = require('electron')
const ElectronStore = require('electron-store')
const path = require('path')
let win

async function createWindow () {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        
        webPreferences: {
            
            preload: path.join(`${__dirname}/preload.js`),
        },  
    })
    

    win.loadFile(path.join(__dirname, 'index.html'))
}


// function newStore(name, schema) {
//     name = new ElectronStore(schema)
//     win.webContents.send("fromMain", responseObj)
// }
app.whenReady().then(() => {
    createWindow()
    // ipcMain.on('store', newStore)
    app.on('activate', ()=>{
        if(BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () =>{
    if (process.platform !== 'darwin') app.quit()
})

