const {app, BrowserWindow, ipcMain} = require('electron');
const clearCookies = require('./clearCookies');
// const acceptLizhilist = require('./acceptLizhiList');
// const acceptLizhiDetail = require('./acceptLizhiDetail');
const lizhiListener = require('./assets/lizhi/listener');
const fs = require('fs');
const getFileSync = require('./common/getFileSync');
const executeJs = require('./common/executeJs');
var category = '';

let win;

//监听index页面选择抓取网站
ipcMain.on('get-url', (event, args) => {
    category = args;
    if (category === 'lizhi') {
        win.loadURL('https://m.weike.fm/cps/objlist');
        lizhiListener(win);
    } else {
        win.loadURL('https://m.qlchat.com/pc/knowledge-mall/index?selectedLiveId=2000002028384735');
    }
    win.loadURL(args);
});


app.on('ready', function () {
    win = new BrowserWindow({
        width: 800, height: 600,
    });
    win.loadFile('index.html');
    win.maximize();
    var content = win.webContents;
    content.openDevTools();

    content.on('did-finish-load', function () {
        content.executeJavaScript(getFileSync('./assets/jquery-1.8.1.min.js'), (results) => {
            if (category === 'lizhi') {
                fs.readFile('./assets/lizhi/main.js', {encoding: 'utf-8'}, function (err, data) {
                    if (err) throw err;
                    content.executeJavaScript(data, (results) => {
                    });
                })
            } else {
                executeJs(content, getFileSync('./assets/qianliao/main.js'))
            }
        });
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
