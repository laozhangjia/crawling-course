const {app, BrowserWindow, ipcMain, session} = require('electron');
const clearCookies = require('./clearCookies');
const acceptLizhilist = require('./acceptLizhiList');
const acceptLizhiDetail = require('./acceptLizhiDetail');
var fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

//监听荔枝微课数据写入
// acceptLizhilist();
acceptLizhiDetail();

let win;

var lizhiList = JSON.parse(fs.readFileSync('./lizhidetail.json', {encoding: 'utf-8'})).data;

//跳转下一页
console.log('lizhidetail.json count', lizhiList.length);
var i = 0;

function jumpToNext() {
    i++;
    if (i < lizhiList.length) {
        win.loadURL(lizhiList[i]['lesson_url']);
    } else {
        console.log('DATA INDEX', i);
        console.log('lizhidetail.json length:', lizhiList.length);
        fs.writeFile('./lizhidetail.json', JSON.stringify({data: lizhiList}), (err) => {
            throw err;
        })
    }
}

ipcMain.on('addLinkDone', (event, args) => {
    console.log('id:', args, 'index:', i);
    lizhiList[i]['lesson_subtitle'] = args['subtitle'];
    lizhiList[i]['teacher'] = args['teacherName'];
    lizhiList[i]['virtual_buynum'] = args['virtual_buynum'];
    lizhiList[i]['lesson_chapter_num'] = args['lesson_chapter_num'];
    var bili = lizhiList[i]['teacher_income'];
    lizhiList[i]['teacher_income'] = bili.substring(0, bili.length - 1);
    lizhiList[i]['teacherid'] = args['teacherid'];
    jumpToNext();
});

function createWindow() {

    //清除cookies
    // clearCookies();
    win = new BrowserWindow({
        width: 800, height: 600,
    });
    win.loadURL(lizhiList[0]['lesson_url']);
    win.maximize();
    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null
    });

    var count = 1;
    var content = win.webContents;
    content.on('did-finish-load', function () {
        console.log('page count:', count);
        count++;
        fs.readFile('./assets/jquery-1.8.1.min.js', {encoding: 'utf-8'}, function (err, jquery) {
            content.executeJavaScript(jquery, (results) => {
                fs.readFile('./assets/lizhi/getLizhiTeacher.js', {encoding: 'utf-8'}, function (err, detailjs) {
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
