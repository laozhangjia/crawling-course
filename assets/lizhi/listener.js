function listener(win) {
    const {ipcMain, ipcRenderer} = require('electron');
    const fs = require('fs');
    const path = require('path');
    var currentWindow = win;
    let lizhiList = [];
    var myDistriButionarr = [];
    var newArr = [];
    console.log('step:', global.store.step);
    if (global.store.step) {
        lizhiList = JSON.parse(fs.readFileSync('./assets/lizhi/results/list.json', {encoding: 'utf-8'})).data;
        newArr = JSON.parse(fs.readFileSync('./assets/lizhi/results/concat.json', {encoding: 'utf-8'})).data;
    }

    liszhiListener();

    function liszhiListener(win) {
        ipcRenderer.on('getListItem', function (event, args) {
            lizhiList = lizhiList.concat(args);
        });


//荔枝课程列表获取完成写入json文件
        ipcRenderer.on('getListComplete', function (event, args) {
            debugger;
            alert('数据获取完成');
            lizhiList = lizhiList.concat(args);
            fs.writeFile('./assets/lizhi/results/list.json', JSON.stringify({data: lizhiList}), (err) => {
                if (err) throw err;
                console.log('lizhi list get complete and write complete');
            })
        });
    }

//监听添加渠道链接下一步操作
    ipcMain.on('nextStepAddLink', (event, args) => {
        args && distribution();
    });


//添加分销
    function distribution() {
        currentWindow.loadURL('https://m.weike.fm/cps/cobjsid?pid=' + lizhiList[0]['promoteId']);
    }

    var i = 0;
    ipcMain.on('addLinkDone', (event, args) => {
        i++;
        if (i < lizhiList.length) {
            currentWindow.loadURL('https://m.weike.fm/cps/cobjsid?pid=' + lizhiList[i]['promoteId']);
        } else {
            console.log('add channel link complete');
            event.sender.send('liZhiListAddLinkSuccess', 'success');
        }
    });


//获取我的分销渠道列表
    ipcMain.on('nextStepGetMyDistribution', (event, args) => {
        args && getMyDistribution();
    });

    function getMyDistribution() {
        currentWindow.loadURL('https://m.weike.fm/cps/sourcelist');
    }


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
        fs.writeFileSync('./assets/lizhi/results/concat.json', JSON.stringify({data: newArr}));
        event.sender.send('myDistriButionarrWrited', true);
    });


    ipcMain.on('nextStepGetTeacherInfo', (event, args) => {
        if (args) {
            getTeachersInfo();
        }
    });

//获取教师信息
    function getTeachersInfo() {
        currentWindow.loadURL(newArr[0].lesson_url);
    }

    var teacherIndex = 0;
    ipcMain.on('getTeacherInfo', (event, args) => {
        console.log('id:', args, 'index:', i);
        newArr[teacherIndex]['lesson_subtitle'] = args['subtitle'];
        newArr[teacherIndex]['teacher'] = args['teacherName'];
        newArr[teacherIndex]['virtual_buynum'] = args['virtual_buynum'];
        newArr[teacherIndex]['lesson_chapter_num'] = args['lesson_chapter_num'];
        var bili = newArr[teacherIndex]['teacher_income'];
        newArr[teacherIndex]['teacher_income'] = bili.substring(0, bili.length - 1);
        newArr[teacherIndex]['teacherid'] = args['teacherid'];
        teacherIndex++;
        if (teacherIndex < newArr.length) {
            currentWindow.loadURL(newArr[teacherIndex].lesson_url);
        } else {
            fs.writeFile('./assets/lizhi/results/Final.json', JSON.stringify({data: newArr}), (err) => {
                if (err) throw err;
                console.log('final data get complete. length:', newArr.length);
            });
            event.sender.send('getTeacherInfoSuccess', true);
        }
    })
}

module.exports = listener;