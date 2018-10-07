class qianliaoHandle {
    constructor(tips) {
        this.index = 0;
        this.allPageData = [];
        this.currentPageData = [];
        this.myTransport = [];
        this.finalData = [];
        this.page = 1;
        this.tips = tips;
        this.myTransportPage = 1;
        //课程类目
        this.categorys = [
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
    }

    //获取所有课程
    getList() {
        const _this = this;
        this.allPageData = [];
        this.categorys.forEach((item) => {
            console.log(tips);
            _this.currentPageData = [];
            _this.page = 1;
            _this.getListRequest(item);
        });

        _this.tips.innerText = `所有课程获取完成总共${_this.allPageData.length}条`;

        fs.writeFile(`./assets/qianliao/results/所有课程.json`, JSON.stringify({data: _this.allPageData}), (err) => {
            if (err) throw err;
        });
    }

    getListRequest(item) {
        const _this = this;
        _this.tips.innerText = `正在获取${item.name}`;
        $.ajax({
            type: 'POST',
            url: item.url,
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
                pageNum: _this.page,
                pageSize: 500,
                tagId: item.tagId
            },
            success(res) {
                let list = JSON.parse(res).data.channelList;
                _this.allPageData = _this.allPageData.concat(list);
                _this.currentPageData = _this.currentPageData.concat(list);
                if (list.length > 499) {
                    _this.page = _this.page + 1;
                    _this.getListRequest(item)
                } else {
                    _this.tips.innerText = `${item.name}获取完成`;
                    fs.writeFile(`./assets/qianliao/results/${item.name}.json`, JSON.stringify({data: _this.currentPageData}), (err) => {
                        if (err) throw err;
                    })
                }
            }
        })
    }

    //检查是否获取过所有课程
    checkAllPageData() {
        let filePath = path.join(process.cwd(), 'assets/qianliao/results/所有课程.json');
        let filePathIsExits = fs.existsSync(filePath);
        let allPageData = filePathIsExits && JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'})).data || [];
        if (allPageData.length) {
            this.allPageData = allPageData;
        }
        return allPageData.length;
    }

    //检查本地是否有我的转载列表
    checkMyTransportData() {
        let filePath = path.join(process.cwd(), 'assets/qianliao/results/我的转载.json');
        let filePathIsExits = fs.existsSync(filePath);
        let myTransport = filePathIsExits && JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'})).data || [];
        if (myTransport.length) {
            this.finalData = myTransport;
        }
        return myTransport.length;
    }


    //转载课程
    createTransport() {
        const _this = this;
        if (!this.allPageData.length && !this.checkAllPageData()) {
            alert('请先获取课程列表再进行此操作');
            return;
        }
        this.allPageData.forEach((item, index) => {
            $('#tips').html(`正在转载:${item.businessName}`);
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
                success(res) {
                    console.log(`正在转载第:${index + 1}条`);
                },
                error(err) {
                    alert(`转载${item.businessName}出错,请重试`)
                },
                complete() {
                    if (index === _this.allPageData.length - 1) {
                        tips.innerText = `转载已完成`;
                    }
                }
            })
        })
    }


    //获取我的转载
    getMyTransport() {
        if (!this.allPageData.length && !this.checkAllPageData()) {
            alert('请先获取课程列表再进行此操作');
            return;
        }
        this.myTransportPage = 1;
        this.getMyTransportRequest();
    }

    getMyTransportRequest() {
        const _this = this;
        $.ajax({
            url: 'https://m.qlchat.com/api/wechat/transfer/h5/selfmedia/relayChannels',
            type: 'POST',
            async: false,
            data: {
                isRelay: "Y",
                liveId: "2000002028384735",
                page: {page: _this.myTransportPage, size: 500},
                tagId: 0
            },
            success: function (res) {
                let list = JSON.parse(res).data.liveChannels;
                _this.myTransport = _this.myTransport.concat(list);
                if (list.length > 499) {
                    _this.myTransportPage = _this.myTransportPage + 1;
                    return _this.getMyTransportRequest();
                }
                /*   workbook = new Excel.stream.xlsx.WorkbookWriter({
                       filename: './assets/qianliao/results/qianliao.xlsx'
                   });*/
                let workbook = new Excel.Workbook();
                let worksheet = workbook.addWorksheet('Sheet');
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


                _this.myTransport.forEach((item1) => {
                    let newObj = {};
                    _this.allPageData.forEach((item) => {
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
                    _this.finalData.push(newObj);
                    worksheet.addRow(newObj);
                });
                tips.innerText = `获取我的转载已完成,共:${_this.finalData.length}条数据`;
                let xlsxPath;
                dialog.showOpenDialog({title: '保存我的转载到', properties: ['openDirectory']},
                    (filePath) => {
                        if (filePath) {
                            workbook.xlsx.writeFile(`${filePath}\\我的转载.xlsx`).then(function () {
                                xlsxPath = `${filePath}\\我的转载.xlsx`;
                                shell.openItem(xlsxPath);
                            });
                        } else {
                            workbook.xlsx.writeFile(`${app.getPath('downloads')}\\我的转载.xlsx`).then(function () {
                                xlsxPath = `${app.getPath('downloads')}\\我的转载.xlsx`;
                                shell.openItem(xlsxPath);
                            });
                        }
                    }
                );
                fs.writeFile('assets/qianliao/results/我的转载.json', JSON.stringify({data: _this.finalData}), function (err) {
                    if (err) {
                        console.error(err);
                    }
                    console.log('保存我的转载成功');
                });
            }
        })
    }

    //上传到服务器
    uploadToServer() {
        const _this = this;
        if (!this.finalData.length && !this.checkMyTransportData()) {
            alert('请先获取我已转载的课程再进行此操作');
            return;
        }
        new uploadJson(_this.finalData).upload();
    }
}

exports.qianliaoHandle = qianliaoHandle;


