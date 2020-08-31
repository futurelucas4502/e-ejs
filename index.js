const { app, protocol } = require('electron')
const path = require('path')
const ejs = require('ejs');

app.whenReady().then(() => {
    console.log("Setting up custom ejs protocols...")

    protocol.registerFileProtocol('base', (request, callback) => {
        const url = request.url.substr(6)
        const file = { path: path.normalize(`${process.cwd()}/${url}`) }
        callback(file)
    })
})

console.log("Setting up ejs rendering wrapper...")

module.exports = function ejsWrapper(ejspath, window, data) {
    if (typeof data == undefined || data == undefined || data == null || data == "") {
        data = "{}"
    }
    ejs.renderFile(ejspath, data, (err, str) => {
        window.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(str), {
            baseURLForDataURL: 'base:/' // have to use this as `file://${__dirname}` is broken see here: https://github.com/electron/electron/issues/20700#issuecomment-573847842
        })
    })
}