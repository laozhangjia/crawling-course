const {ipcMain} = require('electron');
const fs = require('fs');
var currentWindow;
let lizhiList = [];
var myDistriButionarr = [];

function liszhiListener(win) {
    currentWindow = win;
    ipcMain.on('getListItem', function (event, args) {
        lizhiList = lizhiList.concat(args);
    });

//荔枝课程列表获取完成写入json文件
    ipcMain.on('getListComplete', function (event, args) {
        lizhiList = lizhiList.concat(args);
        fs.writeFile('./assets/lizhi/results/list.json', JSON.stringify({data: lizhiList}), (err) => {
            if (err) throw err;
            console.log('lizhi list get complete and write complete');
            distribution();
        })
    });
}

//添加分销
function distribution() {
    var i = 0;
    currentWindow.loadURL('https://m.weike.fm/cps/cobjsid?pid=' + lizhiList[i]['promoteId']);
    ipcMain.on('addLinkDone', (event, args) => {
        i++;
        if (i < lizhiList.length) {
            currentWindow.loadURL('https://m.weike.fm/cps/cobjsid?pid=' + lizhiList[i]['promoteId']);
        } else {
            console.log('add channel link complete');

            //分销渠道添加完成开始获取我的分销
            getMyDistribution();
        }
    });
}

//获取我的分销
function getMyDistribution(win) {

    var newArr = [];

    currentWindow = win || null;
    //  var lizhiList = JSON.parse(fs.readFileSync('./assets/lizhi/results/list.json', {encoding: 'utf-8'})).data;
    console.log('lizhilist length', lizhiList.length);
    currentWindow.loadURL('https://m.weike.fm/cps/sourcelist');
    ipcMain.on('getMyDistributionItem', (event, args) => {
        myDistriButionarr = myDistriButionarr.concat(args);
    });

    ipcMain.on('getMyDistributionComplete', (event, args) => {
        myDistriButionarr = myDistriButionarr.concat(args);

        console.log('myDistriButionarr length', myDistriButionarr.length);
        fs.writeFileSync('./assets/lizhi/results/my-distribution.json', JSON.stringify({data: myDistriButionarr}));
        var number = 1;
        myDistriButionarr.forEach((item) => {
            lizhiList.forEach((item1) => {
                if (item1.sameId == item.sameId) {
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
        //获取我的分销完成开始获取教师详细信息
        getTeachersInfo(newArr);
    })
}

//获取教师信息
function getTeachersInfo(newArr) {
    var i = 0;
    currentWindow.loadURL(newArr[i].lesson_url);

    ipcMain.on('getTeacherInfo', (event, args) => {
        console.log('id:', args, 'index:', i);
        newArr[i]['lesson_subtitle'] = args['subtitle'];
        newArr[i]['teacher'] = args['teacherName'];
        newArr[i]['virtual_buynum'] = args['virtual_buynum'];
        newArr[i]['lesson_chapter_num'] = args['lesson_chapter_num'];
        var bili = newArr[i]['teacher_income'];
        newArr[i]['teacher_income'] = bili.substring(0, bili.length - 1);
        newArr[i]['teacherid'] = args['teacherid'];
        i++;
        if (i < newArr.length) {
            currentWindow.loadURL(newArr[i].lesson_url);
        } else {
            fs.writeFile('./assets/lizhi/results/Final.json', JSON.stringify({data: newArr}), (err) => {
                if (err) throw err;
                console.log('final data get complete. length:', newArr.length);
            })
        }
    })
}

module.exports = liszhiListener;