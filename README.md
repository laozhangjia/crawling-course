#  crawling-course
利用electron爬取千聊、荔枝微课课程信息；实现自动分销课程；获取分销后课程佣金、分成比例、课程推广、课程链接等详细信息；且生成excel保存到本地。
千聊：https://m.qlchat.com/pc/knowledge-mall/index
 荔枝微课：https://m.weike.fm/cps/hotlist

# Getting Started

1.  npm install electron -g
2.	npm isntall 
3.	npm start or electron .
# 文件说明
1. app.js 项目入口文件即主进程
2. index.html 主页面即渲染进程，采用webview的方式加载荔枝微课及千聊
3. assets/lizhi/main.js 爬取荔枝微课，转载课程，获取转载后的课程核心代码
4. assets/qianliao/main.js 爬取千聊课程，转载课程，获取转载后课程核心代码
