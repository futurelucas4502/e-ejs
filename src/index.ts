'use strict';

import { app, protocol } from 'electron';
import path = require('path');
import oEjs = require('ejs');
import url = require('url');
let firstFile: boolean = true;
let currentViewData: any;
let currentOptions: any;
let currentPath: any;
let previousViewData: any;
let previousOptions: any;
function parseFilePath(urlString: any) {
  const parsedUrl = new URL(urlString);
  let fileName = parsedUrl.pathname;
  if (process.platform === 'win32')
    fileName = fileName.substr(1);
  return fileName.replace(/(?:\s|%20)/g, ' ');
}

app.whenReady().then(() => {
  protocol.registerFileProtocol('assets', (request, callback) => {
    const hostName: any = url.parse(request.url).hostname;
    const fileName = parseFilePath(request.url);
    const filePath = path.join(hostName, fileName);
    callback({ path: filePath });
  });
});


export async function renderFile(browserWindow: Electron.BrowserWindow, ejspath: string, data: oEjs.Data, options: oEjs.Options) {
  currentPath = ejspath
  if (typeof data === undefined || data === undefined || data == null) {
    data = {};
  }
  currentViewData = data
  if (typeof options === undefined || options === undefined || options == null || options === '') {
    options = {};
  }
  currentOptions = options
  if (firstFile) {
    protocol.registerBufferProtocol("ejs", (request, callback) => {
      if (request.headers.Accept === '*/*') { // fixes an error that occurs when you open devtools
        currentViewData = previousViewData;
        currentOptions = previousOptions;
      }
      oEjs.renderFile(currentPath, currentViewData, currentOptions, (err, str) => {
        if (err) throw err;
        callback({
          mimeType: 'text/html',
          data: Buffer.from(str),
        });
      });
    })
    firstFile = false
  }
  await browserWindow.loadURL(
    url.format({
      pathname: ejspath,
      protocol: "ejs",
      slashes: true
    }),
  );
  previousViewData = currentViewData
  previousOptions = currentOptions
  currentViewData = undefined
  currentOptions = undefined
}

export function render(window: Electron.BrowserWindow, rawEjs: string, data: oEjs.Data, options: oEjs.Options) {
  if (typeof data === undefined || data === undefined || data == null) {
    data = {};
  }
  if (typeof options === undefined || options === undefined || options == null || options === '') {
    options = {};
  }
  window.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(oEjs.render(rawEjs, data, options).toString()));
}

exports.cache = oEjs.cache;
exports.delimiter = oEjs.delimiter;
exports.openDelimiter = oEjs.openDelimiter;
exports.closeDelimiter = oEjs.closeDelimiter;
exports.cache = oEjs.cache;
exports.fileLoader = oEjs.fileLoader;
exports.compile = oEjs.compile;
