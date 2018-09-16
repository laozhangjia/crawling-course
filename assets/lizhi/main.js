const remote = require('electron').remote;
const fs = require('fs');
const ipRender = require('electron').ipcRenderer;
const currentWindow = remote.getCurrentWindow();

function getQuery(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//获取列表
function getList() {
    var trs = $('.table-striped tbody tr');
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
            ipRender.send('getListItem', courseArr);
            var nextUrl = location.origin + location.pathname + next.attr('href');
            currentWindow.loadURL(nextUrl);
        } else {
            ipRender.send('getListComplete', courseArr);
        }
    }
}

if (location.pathname === '/cps/objlist') {
    getList();
}

//添加分销
function addChannel() {
    var pid = getQuery('pid');
    var _xsrf = $('.page-content input[name="csrfmiddlewaretoken"]').val();
    var data = JSON.stringify({act: "addsid", desc: "分销", pid: pid});
    $.ajax({
        type: 'POST',
        url: "https://m.weike.fm/cps/cobjsid?pid=" + pid,
        sync: false,
        data: {
            data: data,
            "_xsrf": _xsrf
        },
        success: function (res) {
            ipRender.send('addLinkDone', pid)
        },
        error: function (err) {
            throw err;
        }
    });
}

if (location.pathname === '/cps/cobjsid') {
    addChannel();
}


//获取我的分销
if (location.pathname === '/cps/sourcelist') {
    var trs = $('.table-hover tbody tr');
    var arr = [];
    for (var i = 0; i < trs.length; i++) {
        var obj = {};
        var tds = trs.eq(i).find('td');
        obj.channelNumbering = tds.eq(0).text().replace(/\s+/g, "");
        obj.bookname = tds.eq(1).find('a').text().replace(/\s+/g, "");
        obj.statisticsPage = tds.eq(1).find('a').attr('href');
        obj.remarks = tds.eq(2).find('a:last').text().replace(/\s+/g, "");
        obj.createTime = tds.eq(3).text();
        obj.status = tds.eq(4).text().replace(/\s+/g, "") === '有效' ? 1 : 0;
        obj.lesson_url = tds.eq(5).find('a').data('link');
        obj.sameId = tds.eq(5).find('a').data('link').split('/').pop().split('?')[0];
        obj.virtual_buynum = tds.eq(6).text();
        tds.eq(7).children('span').find('span').remove();
        obj.currentIncome = tds.eq(7).children('span').text();
        arr.push(obj);
    }

    goTonextPage();

    function goTonextPage() {
        var next = $('.pagination.pagination-sm').find('li:last').find('a');
        console.log(next.text().replace(/\s+/g, "") === '»');
        if (next.text().replace(/\s+/g, "") === '»') {
            console.log('发送数据给主进程：', arr);
            ipRender.send('getMyDistributionItem', arr);
            var nextUrl = location.origin + location.pathname + next.attr('href');
            currentWindow.loadURL(nextUrl);
        } else {
            ipRender.send('getMyDistributionComplete', arr);
        }
    }

}


//获取课程教师信息
if (getQuery('sid')) {
    getTeachersInfo();
}

function getTeachersInfo() {
    var teacherName = null;
    var subtitle = null;
    var virtual_buynum = 0;
    var lesson_chapter_num = 0;
    var sid = getQuery('sid');
    var teacherid = '';
    $.ajax({
        url: location.origin + '/api' + location.pathname + '/info' + location.search,
        type: 'GET',
        sync: false,
        success: function (res) {
            var stats = res.data.stats_info || res.data.stats;
            var channel = res.data.channel || res.data.lecture;
            lesson_chapter_num = stats.lecture_count || 0;
            virtual_buynum = stats.popular;
            teacherName = res.data.liveroom.name;
            teacherid = res.data.liveroom.id;
            subtitle = channel.subtitle;

            ipRender.send('getTeacherInfo', {
                teacherName: teacherName,
                subtitle: subtitle,
                virtual_buynum: virtual_buynum,
                lesson_chapter_num: lesson_chapter_num,
                teacherid: teacherid
            });
        },
        error: function (err) {
            throw err;
        }
    });
}





