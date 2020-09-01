# e-ejs

Work in progress!

The goal of this project is to be the simplest and easiest to use ejs renderer for electron

There are other great ejs electron renderers out there but a lot of them lack features which you would get from standard ejs and those that don't are big and clunky therefore i made this as a solution

The package supports full ejs as it simply functions as a wrapper for the standard `ejs.renderFile()` function in the ejs library

You can install it using:

`npm i @futurelucas4502/e-ejs`

Note: You **DON'T** need to install ejs aswell

# Example usage:

## main.js:
```
// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.ejs of the app.
  ejs("index.ejs", mainWindow, {
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
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
  </head>
  <body>
    <h1><%= msg %> World!</h1>
  </body>
</html>
```

## A note on CSP (content-security-policy):

If you are using CSP you will need to allow ejs to access all your assets that are used in the page e.g. if i had the following line in my index.ejs:
```
<script src="./renderer.js"></script>
```

Then if im using a CSP it won't work by default you'll need to add `ejs:` to the CSP to make it work like so:

```
<meta http-equiv="Content-Security-Policy" content="default-src 'self' ejs:">
<meta http-equiv="X-Content-Security-Policy" content="default-src 'self' ejs:">
```
