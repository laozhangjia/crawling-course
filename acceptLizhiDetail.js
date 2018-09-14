const {ipcMain} = require('electron');
const fs = require('fs');
let dataJson = [];
var newArr = [];


function startListen() {
    ipcMain.on('lizhiDetailDone', (event, args) => {
        console.log('data done');
        var number = 1;
        dataJson = dataJson.concat(args);
        var courseList = fs.readFileSync('./lizhi.json', {encoding: 'utf-8'});

        dataJson.forEach((item) => {
            JSON.parse(courseList).data.forEach((item1) => {
                var index = item.bookname.indexOf('/');
                var name = '';
                if (index > -1) {
                    name = item.bookname.slice(++index)
                } else {
                    name = item.bookname;
                }
                if (item1.sameId === item.sameId) {
                    console.log('current index:', number);
                    number++;
                    var newObj = {};
                    newObj.channelNumber = item.channelNumbering;
                    newObj.bookname = item1.courseName; //课程名
                    newObj.lesson_id = item1.promoteId; //课程ID
                    newObj.images = item1.banner;       //封面图
                    newObj.origin_price = 0;            //原价
                    newObj.price = item1.price;         //定价
                    newObj.lesson_subtitle = '';        //课程副标题
                    newObj.lesson_chapter_num = 0;   //课程数
                    newObj.virtual_buynum = item.virtual_buynum;  //以售卖数量
                    newObj.teacher_income = item1.proportion; //分成比例
                    newObj.teacherid = item1.liveId;        //课程来源id
                    newObj.teacher = item1.liveName;          //作者名
                    newObj.isdiscount = 0;
                    newObj.status = item.status;            //是否有效
                    newObj.support_coupon = 0;              //是否支持优惠券
                    newObj.is_open_recommend = 0;           //是否开启推荐
                    newObj.tagId = '';
                    newObj.category_name = item1.category;
                    newObj.lesson_url = item.lesson_url;      //课程链接
                    newObj.lesson_source = '微课';
                    newArr.push(newObj);
                }

            })
        });


        fs.writeFile('./lizhidetail.json', JSON.stringify({data: newArr}), function (err) {
            if (err) throw err;
            console.log('lizhi detail saved', dataJson.length);
        })
    });

    ipcMain.on('lizhiDetailArrivals', (event, args) => {
        dataJson = dataJson.concat(args);
        console.log('lizhi detail come here');
    });
}

module.exports = startListen;