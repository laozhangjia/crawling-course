//添加转载链接

var ipRender = require('electron').ipcRenderer;

if (location.pathname === '/cps/cobjsid') {
    function getQuery(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var pid = getQuery('pid');
    var _xsrf = $('.page-content input[name="csrfmiddlewaretoken"]').val();

    addChannelLink();

//添加渠道链接
    function addChannelLink() {
        var data = JSON.stringify({act: "addsid", desc: "分销", pid: pid});
        $.ajax({
            type: 'POST',
            url: "https://m.weike.fm/cps/cobjsid?pid=" + pid,
            sync: false,
            data: {
                data: data,
                "_xsrf": _xsrf
            },
            success: function (res) {
                ipRender.send('addLinkDone', pid)
            },
            error: function (err) {
                throw err;
            }
        });
    }
}