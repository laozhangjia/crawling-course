const {ipcMain} = require('electron');
const fs = require('fs');
let dataJson = [];

function startListen() {
    ipcMain.on('data-done', (event, args) => {
        console.log('data done');
        dataJson = dataJson.concat(args);
        fs.writeFile('./lizhi.json', JSON.stringify({data: dataJson}), function (err) {
            if (err) throw err;
            console.log('data saved', dataJson.length);
        })
    });

    ipcMain.on('data-arrivals', (event, args) => {
        dataJson = dataJson.concat(args);
        console.log('data come here');
    });

}

module.exports = startListen;