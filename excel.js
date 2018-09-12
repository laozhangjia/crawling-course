var path = require('path');
var fs = require("fs");


fs.readdir('./数据', function (err, files) {
    if (err) console.error(err);
    console.log(files);
});


// var Excel = require('excel');
//
// var start_time = new Date();
// var workbook = new Excel.stream.xlsx.WorkbookWriter({
//     filename: './streamed-workbook.xlsx'
// });
// var worksheet = workbook.addWorksheet('Sheet');
//
// worksheet.columns = [
//     {header: 'id', key: 'id'},
//     {header: 'name', key: 'name'},
//     {header: 'phone', key: 'phone'}
// ];
//
// var length = data.length;
//
// console.log('开始添加数据');
// // 开始添加数据
// for (let i in data) {
//     worksheet.addRow(data[i]).commit();
// }
// workbook.commit();

