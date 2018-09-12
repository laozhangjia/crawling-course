console.info("爬虫js2注入完成")
var addEvent = function (el, type, fn) {
    if (window.addEventListener) {
        el.addEventListener(type, fn, false);
        return;
    }
    el.attachEvent("on" + type, fn);
}

function isNull(obj) {
    if (typeof (obj) == "undefined")
        return true;
    if (obj == undefined)
        return true;
    if (obj == null)
        return true;
    if (obj === "")
        return true;
    return false;
}
String.prototype.trimStart = function String$trimStart() {
    return this.replace(/^\s*/, "")
};
String.prototype.trimEnd = function String$trimEnd() {
    return this.replace(/\s*$/, "")
};
String.prototype.startsWith = function String$startsWith(a) {
    return this.indexOf(a) == 0
};
String.prototype.trim = function String$trim() {
    return this.trimStart().trimEnd()
};
String.prototype.endsWith = function String$endsWith(b) {
    var a = this.lastIndexOf(b);
    return a >= 0 && a == this.length - b.length ? true : false
};
String.prototype.contains = function String$contains(a) {
    return this.indexOf(a) >= 0
};
String.prototype.format = function String$format() {
    for (var b = this, a = 0; a < arguments.length; a++)
        b = b.replace(RegExp("\\{" + a + "\\}", "g"), arguments[a]);
    return b
};

window.onerror = function (msg, url, line, col, error) {
    //没有URL不上报！上报也不知道错误
    //if (msg != "Script error." && !url) {
    //    return true;
    //}

    //采用异步的方式
    //我遇到过在window.onunload进行ajax的堵塞上报
    //由于客户端强制关闭webview导致这次堵塞上报有Network Error
    //我猜测这里window.onerror的执行流在关闭前是必然执行的
    //而离开文章之后的上报对于业务来说是可丢失的
    //所以我把这里的执行流放到异步事件去执行
    //脚本的异常数降低了10倍
    setTimeout(function () {
        var data = {};
        //不一定所有浏览器都支持col参数
        col = col || (window.event && window.event.errorCharacter) || 0;

        data.url = url;
        data.line = line;
        data.col = col;
        if (!!error && !!error.stack) {
            //如果浏览器有堆栈信息
            //直接使用
            data.msg = error.stack.toString();
        } else if (!!arguments.callee) {
            //尝试通过callee拿堆栈信息
            var ext = [];
            var f = arguments.callee.caller, c = 3;
            //这里只拿三层堆栈信息
            while (f && (--c > 0)) {
                ext.push(f.toString());
                if (f === f.caller) {
                    break;//如果有环
                }
                f = f.caller;
            }
            ext = ext.join(",");
            data.msg = error.stack.toString();
        }
        //把data上报到后台！
    }, 0);

    return true;
}

var getUrlParam = function (name) {
    var url = window.location.href;
    url = url.replace("#", "&");
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = url.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
}

function loadScript(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE  
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                if (callback != null)
                    callback();
            }
        };
    } else { //Others  
        script.onload = function () {
            if (callback != null)
                callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function loadCSS(url) {
    var cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.rev = "stylesheet";
    cssLink.type = "text/css";
    cssLink.media = "screen";
    cssLink.href = url;
    document.getElementsByTagName("head")[0].appendChild(cssLink);
}

function loadApp() {
    console.log("jhfasjdfl");
}

function initModule() {
    console.info("爬虫模块初始化")
}
initModule();