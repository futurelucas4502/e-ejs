# e-ejs

[![GitHub issues](https://img.shields.io/github/issues/futurelucas4502/e-ejs)](https://github.com/futurelucas4502/e-ejs/issues)[![GitHub forks](https://img.shields.io/github/forks/futurelucas4502/e-ejs)](https://github.com/futurelucas4502/e-ejs/network)[![GitHub stars](https://img.shields.io/github/stars/futurelucas4502/e-ejs)](https://github.com/futurelucas4502/e-ejs/stargazers)[![GitHub license](https://img.shields.io/github/license/futurelucas4502/e-ejs)](https://github.com/futurelucas4502/e-ejs/blob/master/LICENSE)[![Dev dependencies](https://david-dm.org/futurelucas4502/e-ejs/dev-status.svg)](https://david-dm.org/futurelucas4502/e-ejs?type=dev)[![Dependencies](https://david-dm.org/futurelucas4502/e-ejs.svg)](https://david-dm.org/futurelucas4502/e-ejs)![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/futurelucas4502/e-ejs)![npm (scoped)](https://img.shields.io/npm/v/@futurelucas4502/e-ejs)

The goal of this project is to be the simplest and easiest to use ejs renderer for electron

There are other great ejs electron renderers out there but a lot of them lack features which you would get from standard ejs and those that don't are big and clunky therefore I made this as a solution

The package supports all the ejs functions from the official library with `ejs.render()` and `ejs.renderFile()` being the only difference's to use them the first thing you pass must be your browser window see [example usage](#example-usage) below.

You can install it using:

`npm i @futurelucas4502/e-ejs`

Note: You **DON'T** need to install ejs aswell

# Example renderFile() usage:

## File structure:
```
project/
├── assets/
│   ├── stylesheets/
│   │   └── main.css
│   └── javascripts/
│       └── renderer.js
├── views/
│   └── index.ejs
├── main.js
└── package.json
```

## main.js:
```js
// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const ejs = require('@futurelucas4502/e-ejs')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  // and load the index.ejs of the app.
  ejs.renderFile(mainWindow, "views/index.ejs", {
    msg: "Hello"
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
```

## index.ejs:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
  </head>
  <body>
    <h1><%= msg %> World!</h1>
    <a href="ejs://otherPage">link</a>
    <script src="assets://javascripts/renderer.js"></script>
  </body>
</html>
```

# Example render() usage:

## File structure:
```
project/
├── assets/
│   ├── stylesheets/
│   │   └── main.css
│   └── javascripts/
│       └── renderer.js
├── main.js
└── package.json
```

## main.js:
```js
// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const ejs = require('@futurelucas4502/e-ejs')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  // and load the index.ejs of the app.
  ejs.render(mainWindow, `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Hello World!</title>
      </head>
      <body>
        <h1><%= msg %> World!</h1>
        <a href="ejs://otherPage">link</a>
        <script src="assets://javascripts/renderer.js"></script>
      </body>
    </html>`, {
    msg: "Hello"
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
```

# A note on CSP (content-security-policy):

If you are using CSP you will need to allow ejs to access all your assets that are used in the page e.g. if i had the following line in my index.ejs:
```js
<script src="assets://javascripts/renderer.js"></script>
```

Then if you're using a CSP it won't work by default as you'll need to add `assets:` to the CSP and to the src to make it work like so:

```js
<meta http-equiv="Content-Security-Policy" content="default-src 'self' assets:">
<meta http-equiv="X-Content-Security-Policy" content="default-src 'self' assets:">
```
