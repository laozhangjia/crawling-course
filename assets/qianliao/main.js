// window.location = "https://m.qlchat.com/wechat/page/recommend?tagId=2000001836208679#subItem";
const fs = nodeRequire("fs");
const path = nodeRequire('path');
const Excel = nodeRequire('exceljs');
const ipRender = nodeRequire('electron').ipcRenderer;
var fenxiaoArr = [];
var myPreintArr = [];
var newArr = [];
var workbook;
var worksheet;
let myReprintPage = 1;
var categoryList = [
    {
        name: '个人提升',
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/courseList',
        tagId: "110000431000015"
    },
    {
        name: '亲子教育',
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/courseList',
        tagId: "110000431000025"
    },
    {
        name: '健康瘦身',
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/courseList',
        tagId: "110000431000046"
    },
    {
        name: '职场技能',
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/courseList',
        tagId: "110000431000070"
    }, {
        name: '生活兴趣',
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/courseList',
        tagId: "110000431000099"
    },
    {
        name: '教育培训',
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/courseList',
        tagId: "110000431000126"
    },
    {
        name: '小初高',
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/courseList',
        tagId: "110000431000150"
    },
    {
        name: '女性时尚',
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/courseList',
        tagId: "110000431000203"
    }, {
        name: '两性情感',
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/courseList',
        tagId: "110000431000260"
    }, {
        name: '投资理财',
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/courseList',
        tagId: "110000431000328"
    }, {
        name: '读书文化',
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/courseList',
        tagId: "110000431000419"
    },
];

startPostData();

function startPostData() {
    var pageNum = 1;
    var postUrl = null;
    var postPath = '';
    var tagId = '';
    var postResults = [];

    categoryList.forEach(function (childrenItem) {
        postResults = [];
        postUrl = childrenItem.url;
        pageNum = 1;
        tagId = childrenItem.tagId;
        postPath = './assets/qianliao/results/' + childrenItem.name + '.json';
        ipRender.sendToHost('getQianliaoLsit', '正在获取' + childrenItem.name + '分类');
        postData(childrenItem);
    });

    fs.writeFile('./assets/qianliao/results/all.json', JSON.stringify({data: fenxiaoArr}), (err) => {
        if (err) {
            console.error(err)
        }
        console.log('文件已保存:', path);
    });


    ipRender.sendToHost('getQianliaoLsit', '所有分类已获取完成共' + fenxiaoArr.length + '条');

    fenxiaoArr.map(function (item) {
        Reprint(item);
    });

    getMyReprint();


    function postData(childrenItem) {
        $.ajax({
            type: "POST",
            url: postUrl,
            async: false,
            data: {
                agentId: "",
                channelName: "",
                isRecommend: "N",
                liveId: null,
                notRelayOnly: "N",
                orderBuyNumber: "",
                orderEndRate: "",
                orderPrice: "",
                orderReward: "",
                pageNum: pageNum,
                pageSize: 10000,
                tagId: tagId
            },
            success: function (res) {
                var data = JSON.parse(res);
                var list = data.data.channelList;
                console.log('list:', list);
                fenxiaoArr = fenxiaoArr.concat(list);
                postResults = postResults.concat(list);
                if (list.length > 9999) {
                    pageNum += 1;
                    postData();
                } else {
                    //  写入json文件
                    console.log(postResults);
                    ipRender.sendToHost('getQianliaoLsit', childrenItem.name + '分类获取完成共:' + postResults.length, childrenItem.name, postResults);
                    fs.writeFile(postPath, JSON.stringify({data: postResults}), (err) => {
                        if (err) {
                            console.error(err)
                        }
                        console.log('文件已保存:', postPath);
                    });
                }
            }
        })
    }
}

var count = 0;

//一键转载
function Reprint(item) {
    $.ajax({
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/relayChannel',
        type: 'POST',
        async: false,
        data: {
            pushStatus: null,
            relayLiveId: "2000002028384735",
            sourceChannelId: item.businessId,
            tagId: 0,
            tweetId: item.tweetId
        },
        success: function (res) {
            count++;
            console.log('正在转载第:', count, '条');
            ipRender.sendToHost('getQianliaoLsit', item.businessName + '转载成功');
        }
    })
}


//获取我已分销

function getMyReprint() {
    ipRender.sendToHost('getQianliaoLsit', '正在获取我的转载课程');

    $.ajax({
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/relayChannels',
        type: 'POST',
        async: false,
        data: {
            isRelay: "Y",
            liveId: "2000002028384735",
            page: {page: myReprintPage, size: 500},
            tagId: 0
        },
        success: function (res) {
            var results = JSON.parse(res).data.liveChannels;
            myPreintArr = myPreintArr.concat(results);
            console.log('mypreintarr:', myPreintArr.length);
            if (results.length > 499) {
                myReprintPage += 1;
                return getMyReprint();
            }
            workbook = new Excel.stream.xlsx.WorkbookWriter({
                filename: './assets/qianliao/results/qianliao.xlsx'
            });
            worksheet = workbook.addWorksheet('Sheet');

            worksheet.columns = [
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
                {header: '推广链接', key: 'tweetLink'},
            ];


            myPreintArr.forEach((item1) => {
                var newObj = {};
                fenxiaoArr.forEach((item) => {
                    if (item.businessName.replace(/\s*/g, "") == item1.name.replace(/\s*/g, "")) {
                        item1.tagName = item.tagName;
                        item1.isRecommend = item.isRecommend;
                        item1.lesson_source = '千聊';
                        item1.sourceLiveId = item.liveId;
                        item1.sourceLiveName = item.liveName;
                        item1.tagId = item.tagId;
                    }
                });
                newObj.bookname = item1.name;
                newObj.lesson_id = item1.id;
                newObj.images = item1.headImage;
                newObj.origin_price = item1.amount;
                newObj.price = item1.price;
                newObj.lesson_subtitle = item1.tweetTitle;
                newObj.lesson_chapter_num = item1.topicCount;
                newObj.virtual_buynum = item1.learningNum;
                newObj.teacher_income = item1.selfMediaPercent;
                newObj.teacherid = item1.liveId;
                newObj.teacher = item1.liveName;
                newObj.isdiscount = item1.discountStatus === 'Y' ? 1 : 0;
                newObj.status = item1.displayStatus === 'Y' ? 1 : 0;
                newObj.support_coupon = item1.isCouponOpen === 'Y' ? 1 : 0;
                newObj.is_open_recommend = item1.isRecommend === 'Y' ? 1 : 0;
                newObj.tagId = item1.tagId;
                newObj.category_name = item1.tagName;
                newObj.lesson_url = 'https://m.qlchat.com/wechat/page/channel-intro?channelId=' + item1.id;
                newObj.tweetLink = item1.tweetUrl;
                newObj.lesson_source = '千聊';
                newArr.push(newObj);
                worksheet.addRow(newObj).commit();
            });
            workbook.commit();
            fs.writeFile('assets/qianliao/results/我的转载.json', JSON.stringify({data: newArr}), function (err) {
                if (err) {
                    console.error(err);
                }
                var excelPath = path.join(process.cwd(), 'assets/qianliao/results/qianliao.xlsx');
                ipRender.sendToHost('getQianliaoLsit', '我的转载获取完成共' + newArr.length + '条;生成excel路径为:' + excelPath);
                console.log('保存我的转载成功');
            });
        }
    })
}




