const {ipcMain} = require('electron');
const fs = require('fs');

function acceptLizhiTeacher(win) {

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

            fs.watchFile('./lizhidetail.json', JSON.stringify({data: listener()}), (err) => {
                throw err;
            })

        }
    }
}