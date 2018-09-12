// Modules to control application life and create native browser window
const {
    app,
    BrowserWindow
} = require('electron');
var fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
            width: 800,
            height: 600
        },
    );
    // and load the index.html of the app.
    mainWindow.loadURL("https://m.qlchat.com/pc/knowledge-mall/index");
    // mainWindow.loadFile("./index.html");
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    fs.readFile("./assets/electron_helper.js", "utf-8", function (err, electron_helper_data) {
        if (err) {
            console.log("读取失败:" + err)
        } else {
            mainWindow.webContents.executeJavaScript(electron_helper_data, function (result) {
                fs.readFile("./assets/inject.js", "utf-8", function (err, injectdata) {
                    if (err) {
                        console.log("读取失败:" + err)
                    } else {
                        mainWindow.webContents.executeJavaScript(injectdata, function (result) {
                            fs.readFile("./assets/jquery-1.8.1.min.js", "utf-8", function (err, data) {
                                if (err) {
                                    console.log("读取失败:" + err)
                                } else {
                                    mainWindow.webContents.executeJavaScript(data, function (result) {
                                        fs.readFile("./assets/test.js", "utf-8", function (err, test) {
                                            if (err) {
                                                console.log("读取失败:" + err)
                                            } else {
                                                mainWindow.webContents.executeJavaScript(test, true, function (result) {
                                                }, 3000)
                                            }
                                        });
                                    })
                                }
                            });
                        })
                    }
                });
            })
        }
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.