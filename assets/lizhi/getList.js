//获取所有课程

console.log(location.href);
var fs = require('fs');
var remote = require('electron').remote;
var ipRender = require('electron').ipcRenderer;
var currentWindow = remote.getCurrentWindow();

function getQuery(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var trs = $('.table-striped tbody tr');
String.prototype.RemoveSpace = function () {
    return this.replace(/\s+/g, "");
};

var courseArr = [];
for (var i = 0; i < trs.length; i++) {
    var courseObj = {};
    var tds = trs.eq(i).find('td');
    courseObj.promoteId = trs.eq(i).attr('data-promote-id');
    courseObj.courseName = tds.eq(0).find('a').text().replace(/\s+/g, "");
    courseObj.courseLink = tds.eq(0).find('a').attr('href').replace(/\s+/g, "");
    courseObj.smaeId = tds.eq(0).find('a').attr('href').split('/').pop().split('?')[0];
    courseObj.banner = tds.eq(1).find('img').attr('src').replace(/\s+/g, "");
    courseObj.prop = tds.eq(2).text().replace(/\s+/g, "");
    courseObj.category = tds.eq(3).text().replace(/\s+/g, "");
    courseObj.price = tds.eq(4).text().replace(/\s+/g, "");
    courseObj.commission = tds.eq(5).find('span').text().replace(/\s+/g, "");
    tds.eq(5).find('span').remove();
    courseObj.proportion = tds.eq(5).text().replace(/\s+/g, "");
    courseObj.arpu = tds.eq(6).text().replace(/\s+/g, "");
    courseObj.tweetArticle = tds.eq(7).find('a').attr('href');
    courseObj.tweetLink = location.origin + tds.eq(8).find('a').attr('href');
    courseArr.push(courseObj);
}

//跳转下一页
goTonextPage();

function goTonextPage() {
    var next = $('.pagination.pagination-sm').find('li:last').find('a');
    console.log(next.text() === '»');

    if (Number(getQuery('page')) < 10) {
        console.log('发送数据给主进程');
        console.log(courseArr);
        ipRender.send('data-arrivals', courseArr);
        var nextUrl = location.origin + location.pathname + next.attr('href');
        currentWindow.loadURL(nextUrl);
    } else {
        ipRender.send('data-done', courseArr);
    }
}







