function executeJs(content, js) {
    content.on('did-finish-load', function () {
        content.executeJavaScript(js, (results) => {
        })
    })
}

module.exports = executeJs;
