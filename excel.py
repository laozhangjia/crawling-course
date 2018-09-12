import json, xlwt, os

print(os.path.isdir('/数据'))
sheet_head = ['课程名', '标题', '特惠价', '学习人次', '预计收益', '分成比例', '封面图', '课程链接', '微信链接', '价格']


def loopFile(path='数据\\分销'):
    if os.path.isfile(path):
        path_arr = path.split('\\')
        file_name = path_arr[-1].split('.')[0]
        print('当前json:', path)
        if (file_name == '我的转载'):
            with open(path, 'r', encoding='utf8') as fr:
                json_data = json.load(fr)['data']
                book = xlwt.Workbook()  # 创建一个excel对象
                sheet = book.add_sheet(file_name, cell_overwrite_ok=True)  # 添加一个sheet页
                for i in range(len(sheet_head)):
                    sheet.write(0, i, sheet_head[i])
                for line in range(len(json_data)):
                    current = json_data[line]
                    k = line + 1;
                    sheet.write(k, 0, current['name'])
                    sheet.write(k, 1, current['tweetTitle'])
                    sheet.write(k, 2, current['discount'])
                    sheet.write(k, 3, current['learningNum'])
                    sheet.write(k, 4, current['selfMediaProfit'])
                    sheet.write(k, 5, str(current['selfMediaPercent']) + '%')
                    sheet.write(k, 6, current['headImage'])
                    sheet.write(k, 7, 'https://m.qlchat.com/wechat/page/channel-intro?channelId=' + str(current['id']))
                    sheet.write(k, 8, current['tweetUrl'])
                    sheet.write(k, 9, current['amount'])
                print(file_name)
                book.save(file_name + '.xls')
    elif os.path.isdir(path):
        for s in os.listdir(path):
            newDir = os.path.join(path, s)
            loopFile(newDir)


loopFile()
