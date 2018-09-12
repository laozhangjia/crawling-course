//获取我已转载的

if (location.pathname === '/cps/sourcelist') {
    var ipRender = require('electron').ipcRenderer;
    var remote = require('electron').remote;
    var currentWindow = remote.getCurrentWindow();

    var trs = $('.table-hover tbody tr')

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
            ipRender.send('lizhiDetailArrivals', arr);
            var nextUrl = location.origin + location.pathname + next.attr('href');
            currentWindow.loadURL(nextUrl);
        } else {
            ipRender.send('lizhiDetailDone', arr);
        }
    }

}
