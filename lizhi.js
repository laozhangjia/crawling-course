const {app, BrowserWindow, ipcMain, session} = require('electron');
const clearCookies = require('./clearCookies');
const acceptLizhilist = require('./acceptLizhiList');
const acceptLizhiDetail = require('./acceptLizhiDetail');
var fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

//监听荔枝微课数据写入
acceptLizhilist();
acceptLizhiDetail();

let win;

var lizhiList = JSON.parse(fs.readFileSync('./lizhi.json', {encoding: 'utf-8'})).data;

//跳转下一页
console.log('lizhi.json count', lizhiList.length);
var i = 0;

function jumpToNext() {
    i++;
    if (i < lizhiList.length) {
        win.loadURL('https://m.weike.fm/cps/cobjsid?pid=' + lizhiList[i].promoteId)
    } else {
        console.log('DATA INDEX', i);
    }
}

ipcMain.on('addLinkDone', (event, args) => {
    console.log('id:', args, 'index:', i);
    jumpToNext();
});

function createWindow() {

    //清除cookies
    // clearCookies();
    win = new BrowserWindow({
        width: 800, height: 600,
    });
    // , weboPreferences: {ndeIntegration: false}
    //  win.loadURL('https://m.weike.fm');
    win.loadURL('https://m.weike.fm/cps/sourcelist');
    win.maximize();
    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null
    });

    var count = 1;
    var content = win.webContents;
    content.on('dom-ready', function () {
        count++;
        console.log('page count:', count);
        fs.readFile('./assets/jquery-1.8.1.min.js', {encoding: 'utf-8'}, function (err, jquery) {
            content.executeJavaScript(jquery, (results) => {
                fs.readFile('./assets/lizhi/getMyReprint.js', {encoding: 'utf-8'}, function (err, detailjs) {
                    if (err) throw err;
                    content.executeJavaScript(detailjs, function (result) {
                    })
                });
            })
        })
    });
}


app.on('ready', createWindow);

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
