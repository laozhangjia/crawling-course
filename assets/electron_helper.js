
window.electron;
console.info("electron_helper注入完成")
var electron_helper = function () {
    var _init = function () {
        var require = (typeof (noderequire) != "undefined" ? noderequire : require);
        if (require) {
            electron = require('electron');
            if (electron) {
                window.app = electron.app;
                window.remote = electron.remote;
                window.path = require('path')
                window.url = require('url')
                window.shell = electron.shell;
                window.Menu = remote.Menu;
                window.Tray = remote.Tray;
                window.BrowserWindow = remote.BrowserWindow;
                window.screen = electron.screen;
                window.session = electron.session;
            }
            window.fs = require("fs");
        }
    }

    var _getCurrentWindow = function () {
        if (electron) {
            var win = remote.getCurrentWindow();
            return win;
        }
    }

    var _hideCurrentWindow = function () {
        var win = _getCurrentWindow();
        if (win) {
            win.hide();
        }
    }

    var _showCurrentWindow = function () {
        var win = _getCurrentWindow();
        if (win) {
            win.show();
        }
    }

    var _closeCurrentWindow = function () {
        var win = _getCurrentWindow();
        if (win) {
            win.close();
        }
    }
    var _minimizeCurrentWindow = function () {
        var win = _getCurrentWindow();
        if (win) {
            win.minimize();
        }
    }
    var _maximizeCurrentWindow = function () {
        var win = _getCurrentWindow();
        if (win) {
            win.maximize();
        }
    }
    var _buildMenuFromTemplate = function (template) {
        if (Menu) {
            return Menu.buildFromTemplate(template);
        }
    }

    var _createTray = function (icon, tooltip, menu, click) {
        if (Tray && icon) {
            var appTray = new Tray(icon);
            if (tooltip) {
                appTray.setToolTip(tooltip);
            }
            if (menu) {
                appTray.setContextMenu(menu);
            }
            if (click) {
                appTray.on("click", click);
            }

            return appTray;
        }
    }
    var _combineAppPath = function (file) {
        if (path) {
            return path.join(process.cwd(), file)
        }
    }

    var _getAllWindows = function () {
        if (BrowserWindow) {
            var windows = BrowserWindow.getAllWindows();
            return windows;
        }
    }
    const defaultOptions = {
        // 只有平台支持的时候才使用透明窗口
        transparent: false,
        frame: false,
        width: 650,
        height: 400,
        fullscreenable: true,
        hasShadow: true,
        center: true,
        autoHideMenuBar: true,
        resizable: true,
        show: true
    };

    var _createWindow = function (url, options) {
        if (BrowserWindow) {
            var thisOptions = defaultOptions;
            if (options) {
                thisOptions = Object.assign({}, defaultOptions, options);
            }

            // Create the browser window.
            var win = new BrowserWindow(thisOptions);
            win.loadURL(url);
            if (!thisOptions.alwaysOnTop && thisOptions.show) {
                win.setAlwaysOnTop(true);
                win.showInactive();
                win.setAlwaysOnTop(false);
            }
            return win;
        }
    }

    var _createWindowForResource = function (res, options) {
        if (BrowserWindow) {
            var thisOptions = defaultOptions;
            if (options) {
                thisOptions = Object.assign({}, defaultOptions, options);
            }
            // Create the browser window.
            var win = new BrowserWindow(thisOptions);
            console.log("winid:" + win.id);
            win.loadURL(path.join(__dirname, res));
            return win;
        }
    }

    var _toggleCurrentWindowDevTools = function () {
        var win = _getCurrentWindow();
        if (win) {
            win.webContents.toggleDevTools();
        }
    }
    var _getCookies = function () {
        var win = _getCurrentWindow();
        if (win) {
            return win.webContents.session.cookies;
        }
    }
    var _execScriptFile = function (jsfile, onseccess, onjserror) {
        console.info('读取js文件:' + jsfile)
        _readFileContent(jsfile, function (data) {
            if (data) {
                console.info('读取js文件成功')
                try {
                    require('electron').remote.getCurrentWindow().webContents.executeJavaScript(data, onseccess);
                } catch (e) {
                    if (location.pathname.split('/').pop() == 'XWList.aspx') {
                        console.warn('执行失败，刷新当前页数据' + jsfile)
                        eval(localStorage.getItem('page'))
                    } else {
                        console.warn('执行失败，刷新页面' + jsfile)
                        location.href = location.href
                    }

                    //					if(onjserror){
                    //						onjserror(e)
                    //					}
                }
            } else {
                console.warn('读取js文件失败')
            }
        });
    }
    var _execScript = function (js, onseccess) {
        var win = _getCurrentWindow();
        if (win) {
            win.webContents.executeJavaScript(js, onseccess);
        }
    }
    var _readFileContent = function (file, ondata, onerr) {
        try {
            if (ondata) {
                console.log("1");
                fs.readFile(file, "utf-8", function (err, data) {
                    if (err) {
                        console.log("读取失败:" + err)
                    } else {
                        console.log("2");
                        ondata(data);
                    }
                });
            }

        } catch (err) {
            Console.log(err);
            if (onerr) {
                onerr(err);
            } else {
                console.log(e)
            }
        }
        //fs.readFile(file, "utf-8", function(err, data) {
        //	if(err) {
        //		if(onerr) {
        //			onerr(err);
        //		}
        //	} else {

        //	}
        //});
    }
    _init();
    return {
        createWindow: _createWindow,
        createWindowForResource: _createWindowForResource,
        getCurrentWindow: _getCurrentWindow,
        hideCurrentWindow: _hideCurrentWindow,
        showCurrentWindow: _showCurrentWindow,
        buildMenuFromTemplate: _buildMenuFromTemplate,
        createTray: _createTray,
        combineAppPath: _combineAppPath,
        getAllWindows: _getAllWindows,
        closeCurrentWindow: _closeCurrentWindow,
        minimizeCurrentWindow: _minimizeCurrentWindow,
        maximizeCurrentWindow: _maximizeCurrentWindow,
        toggleCurrentWindowDevTools: _toggleCurrentWindowDevTools,
        screen: screen,
        execScriptFile: _execScriptFile,
        readFileContent: _readFileContent,
        getCookies: _getCookies
    };
}();