const remote = nodeRequire('electron').remote;
let store = remote.getGlobal('store');
let ipc = nodeRequire('electron').ipcRenderer;
let remarks = store.remarks;

function getQuery(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

class lizhiHandle {
    constructor() {
        this.currentPageData = [];
    }

    getQuery(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    //获取所有课程列表
    getList() {
        const _this = this;
        let trs = $('.table-striped tbody tr');
        for (let i = 0; i < trs.length; i++) {
            let courseObj = {};
            let tds = trs.eq(i).find('td');
            courseObj.promoteId = trs.eq(i).attr('data-promote-id');
            courseObj.courseName = tds.eq(0).find('a').text().replace(/\s+/g, "");
            courseObj.courseLink = tds.eq(0).find('a').attr('href').replace(/\s+/g, "");
            courseObj.sameId = tds.eq(0).find('a').attr('href').split('/').pop().split('?')[0];
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
            this.currentPageData.push(courseObj);
        }

        if (this.getNextPage()) {
            ipc.sendToHost('getListItem', _this.currentPageData, _this.getNextPage())
        } else {
            ipc.sendToHost('getListComplete', _this.currentPageData);
        }
    }

    //跳转下一页
    getNextPage() {
        const _this = this;
        let nextPage;
        let currentPage = this.getQuery('page');
        let next = $('.pagination.pagination-sm').find('li:last').find('a');
        if (next.text() === '»') {
            nextPage = currentPage && Number(currentPage) + 1 || 2;
            return nextPage;
        } else {
            return false;
        }
    }

    //添加分销
    createTransport() {
        let pid = this.getQuery('pid');
        let trs = $('.table-bordered.table-striped tbody tr');
        let remarksArr = [];
        for (let index = 0; index < trs.length; index++) {
            let tds = trs.eq(index).find('td');
            remarksArr.push(tds.eq(2).text().replace(/\s+/g, ""));
        }
        if (remarksArr.indexOf(remarks) > -1) {
            ipc.sendToHost('addLinkDone', '此课程已经转载过了');
            return;
        }

        let _xsrf = $('.page-content input[name="csrfmiddlewaretoken"]').val();
        let data = JSON.stringify({act: "addsid", desc: remarks, pid: pid});
        $.ajax({
            type: 'POST',
            url: "https://m.weike.fm/cps/cobjsid?pid=" + pid,
            sync: false,
            data: {
                data: data,
                "_xsrf": _xsrf
            },
            success: function (res) {
                // ipc.send('addLinkDone', pid)
                ipc.sendToHost('addLinkDone');
            },
            error: function (err) {
                throw err;
            }
        });
    }


    //获取我的转载
    getMyTransport() {
        let trs = $('.table-hover tbody tr');
        let arr = [];
        for (let i = 0; i < trs.length; i++) {
            let obj = {};
            let tds = trs.eq(i).find('td');
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
        if (this.getNextPage()) {
            ipc.sendToHost('getMyDistributionItem', arr, this.getNextPage());
        } else {
            ipc.sendToHost('getMyDistributionComplete', arr);
        }
    }


    //获取教师信息
    getTeacherInfo() {
        const _this = this;
        let teacherName = null;
        let subtitle = null;
        let virtual_buynum = 0;
        let lesson_chapter_num = 0;
        let sid = this.getQuery('sid');
        let teacherid = '';
        $.ajax({
            url: location.origin + '/api' + location.pathname + '/info' + location.search,
            type: 'GET',
            sync: false,
            success: function (res) {
                let stats = res.data.stats_info || res.data.stats;
                let channel = res.data.channel || res.data.lecture;
                lesson_chapter_num = stats.lecture_count || 0;
                virtual_buynum = stats.popular;
                teacherName = res.data.liveroom.name;
                teacherid = res.data.liveroom.id;
                subtitle = channel.subtitle;
                ipc.sendToHost('getTeacherInfo', {
                    teacherName: teacherName,
                    subtitle: subtitle,
                    virtual_buynum: virtual_buynum,
                    lesson_chapter_num: lesson_chapter_num,
                    teacherid: teacherid,
                    lectures: res.data.lectures || []
                });
            },
            error: function (err) {
                throw err;
            }
        });
    }
}


if (location.pathname === '/cps/objlist') {
    new lizhiHandle().getList();
}


if (location.pathname === '/cps/cobjsid') {
    new lizhiHandle().createTransport();
}


if (location.pathname === '/cps/sourcelist') {
    new lizhiHandle().getMyTransport();
}

if (getQuery('sid')) {
    new lizhiHandle().getTeacherInfo();
}

