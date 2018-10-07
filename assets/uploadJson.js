class uploadJson {
    constructor(arr) {
        this.arr = arr;
    }

    upload() {
        const _this = this;
        let index = 0;
        let count = 0;
        let errCount = 0;
        let exitsCount = 0;
        let length = this.arr.length;
        console.log(`准备上传到服务器，总条数：${this.arr.length}`);
        tips.innerText = '正在上传...此操作可能耗时较久';
        while (index < length) {
            (function (i) {
                $.ajax({
                    url: 'http://mp.weixin.dev.zhongjitech.cn/app/index.php?i=2&c=entry&do=batchupload&m=fy_lessonv2',
                    type: 'POST',
                    data: {
                        lesson_info: [_this.arr[i]]
                    },
                    success: (res) => {
                        let response = JSON.parse(res);
                        if (response.success.length) {
                            count++;
                        }

                        if (response.fail.length) {
                            errCount++;
                        }
                        if (response.exists.length) {
                            exitsCount++;
                        }
                        console.log(`成功${count}条`);
                        tips.innerText = `正在上传...此操作可能耗时较久(${count + errCount + exitsCount}/${length})`;
                        if (count + errCount + exitsCount >= length) {
                            tips.innerText = `上传已结束;成功${count}条,失败${errCount}条,已存在${exitsCount}条`;
                        }
                    },
                    error: () => {
                        errCount++;
                        console.log(`失败${errCount}条`);
                        tips.innerText = `正在上传...此操作可能耗时较久(${count + errCount + exitsCount}/${length})`;
                        if (count + errCount == length) {
                            tips.innerText = `上传已结束;成功${count}条,失败${errCount}条,已存在${exitsCount}条`;
                        }
                    }
                });
            })(index);
            index++;
        }
    }
}

exports.uploadJson = uploadJson;