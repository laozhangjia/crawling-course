global.store = {remarks: ''};
const {app, BrowserWindow, ipcMain} = require('electron');
const clearCookies = require('./clearCookies');
const path = require('path');
let win;
let win2;
var content;
global.sharedObject = {
    win: null,
    win2: null
};


app.on('ready', function () {
    win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js')
        }
    });
    win2 = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js')
        }
    });
    global.sharedObject.win2 = win2.id;
    global.sharedObject.win = win.id;
    win.loadFile('index.html');
    win.openDevTools();
    content = win.webContents;

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
