// window.location = "https://m.qlchat.com/wechat/page/recommend?tagId=2000001836208679#subItem";
var fs = require("fs");
fs.readFile('assets/input.txt', function (err, data) {
    if (err) {
        return console.error(err);
    }
    console.log("异步读取文件数据: " + data.toString());
});


var fenxiaoArr = [];
var myPreintArr = [];
var newArr = [];
var postArr = [
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

    postArr.forEach(function (childrenItem) {
        postResults = [];
        postUrl = childrenItem.url;
        pageNum = 1;
        tagId = childrenItem.tagId;
        postPath = '数据/' + '分销/' + childrenItem.name + '.json';
        postData();
    });

    fs.writeFile('数据/分销/all.json', JSON.stringify({data: fenxiaoArr}), (err) => {
        if (err) {
            console.error(err)
        }
        console.log('文件已保存:', path);
    });


    console.log('可分销数据arr:', fenxiaoArr.length);

    fenxiaoArr.map(function (item) {
        Reprint(item);
    });

    getMyReprint();


    function postData() {
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
                    fs.writeFile(postPath, JSON.stringify({data: postResults}), (err) => {
                        if (err) {
                            console.error(err)
                        }
                        console.log('文件已保存:', path);
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
            console.log('正在转载第:', count, '条')
        }
    })
}


//获取我已分销


function getMyReprint() {
    $.ajax({
        url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/relayChannels',
        type: 'POST',
        async: false,
        data: {
            isRelay: "Y",
            liveId: "2000002028384735",
            page: {page: 1, size: 50000},
            tagId: 0
        },
        success: function (res) {
            var results = JSON.parse(res).data.liveChannels;
            myPreintArr = myPreintArr.concat(results);
            fenxiaoArr.forEach((item) => {
                myPreintArr.forEach((item1) => {
                    if (item.businessName === item1.name) {
                        var newObj = {};
                        item1.tagName = item.tagName;
                        item1.isRecommend = item.isRecommend;
                        item1.lesson_source = '千聊';
                        item1.sourceLiveId = item.liveId;
                        item1.sourceLiveName = item.liveName;
                        item1.tagId = item.tagId;

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
                        newObj.lesson_source = '千聊';
                        newArr.push(newObj);
                    }
                })
            });

            fs.writeFile('数据/分销/我的转载.json', JSON.stringify({data: newArr}), function (err) {
                if (err) {
                    console.error(err);
                }
                console.log('保存我的转载成功');
            });
        }
    })
}





