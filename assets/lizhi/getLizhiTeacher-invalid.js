// 获取荔枝微课老师内容
console.log(location.href);
var ipRender = require('electron').ipcRenderer;

function getQuery(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

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

        ipRender.send('addLinkDone', {
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
















