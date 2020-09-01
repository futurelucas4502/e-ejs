const { app, protocol } = require('electron')
const path = require('path')
const ejs = require('ejs');

app.whenReady().then(() => {
    protocol.registerFileProtocol('ejs', (request, callback) => {
        const url = request.url.substr(6)
        const file = { path: path.normalize(`${process.cwd()}/${url}`) }
        callback(file)
    })
})

module.exports = function ejsWrapper(ejspath, window, data) {
    if (typeof data == undefined || data == undefined || data == null || data == "") {
        data = "{}"
    }
    ejs.renderFile(ejspath, data, (err, str) => {
        window.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(str), {
            baseURLForDataURL: 'ejs:/' // have to use this as `file://${__dirname}` is broken see here: https://github.com/electron/electron/issues/20700#issuecomment-573847842
        })
    })
}