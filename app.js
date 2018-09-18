global.store = {remarks: ''};
const {app, BrowserWindow, ipcMain} = require('electron');
const clearCookies = require('./clearCookies');
const path = require('path');
const lizhiListener = require('./assets/lizhi/listener');
let win;
var content;


app.on('ready', function () {
    win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js')
        }
    });
    win.loadFile('index.html');
    win.maximize();
    content = win.webContents;
    content.openDevTools();

    content.on('did-finish-load', function () {
    });

    win.on('closed', () => {
        win = null
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});
