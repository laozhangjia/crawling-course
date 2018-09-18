var Excel = require('exceljs');
var fs = require('fs');

var start_time = new Date();
var workbook = new Excel.stream.xlsx.WorkbookWriter({
    filename: './streamed-workbook.xlsx'
});
var worksheet = workbook.addWorksheet('Sheet', {properties: {tabColor: {argb: 'FF00FF00'}}});

worksheet.columns = [
    {header: '渠道编号', key: 'channelNumber'},
    {header: '课程名', key: 'bookname'},
    {header: '分类', key: 'category_name'},
    {header: '封面图', key: 'images'},
    {header: '价格', key: 'price'},
    {header: '分成比例', key: 'teacher_income'},
    {header: '推广标题', key: 'lesson_subtitle'},
    {header: '课程数', key: 'lesson_chapter_num'},
    {header: '购买人数', key: 'virtual_buynum'},
    {header: '教师', key: 'teacher'},
    {header: '课程链接', key: 'lesson_url'},
];

var data = JSON.parse(fs.readFileSync('./assets/lizhi/results/Final.json', {encoding: 'utf-8'})).data;
var length = data.length;

// 当前进度
var current_num = 0;
var time_monit = 400;
var temp_time = Date.now();

console.log('开始添加数据');
// 开始添加数据
for (let i in data) {
    worksheet.addRow(data[i]).commit();
    current_num = i;
    if (Date.now() - temp_time > time_monit) {
        temp_time = Date.now();
        console.log((current_num / length * 100).toFixed(2) + '%');
    }
}
console.log('添加数据完毕：', (Date.now() - start_time));
workbook.commit();

var end_time = new Date();
var duration = end_time - start_time;

console.log('用时：' + duration);
console.log("程序执行完毕");
