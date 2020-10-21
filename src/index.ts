'use strict';

import { app, protocol } from 'electron';
import path = require('path');
import oEjs = require('ejs');
import url = require('url');
let firstFile: boolean = true;
let currentViewData: any;
let currentOptions: any;
const previousViewData: any = {};
const previousOptions: any = {};
function parseFilePath(urlString: any) {
  const parsedUrl = new URL(urlString);
  let fileName = parsedUrl.pathname;
  if (process.platform === 'win32') fileName = fileName.substr(1);
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

export function renderFile(
  browserWindow: Electron.BrowserWindow,
  ejspath: string,
  data: oEjs.Data,
  options: oEjs.Options,
) {
  if (firstFile) {
    protocol.registerBufferProtocol('ejs', (request, callback) => {
      const ejsPath = request.url.substring(7);
      if (request.headers.Accept === '*/*' || request.headers.hasOwnProperty('Upgrade-Insecure-Requests')) {
        // fixes an error that occurs when you open devtools
        currentViewData = previousViewData[ejsPath];
        currentOptions = previousOptions[ejsPath];
      } else {
        currentViewData = JSON.parse(request.headers.currentViewData);
        currentOptions = JSON.parse(request.headers.currentOptions);
      }
      oEjs.renderFile(ejsPath, currentViewData, currentOptions, (err, str) => {
        if (err) throw err;
        callback({
          mimeType: 'text/html',
          data: Buffer.from(str),
        });
        if (request.headers.Accept !== '*/*' || !request.headers.hasOwnProperty('Upgrade-Insecure-Requests')) {
          previousViewData[ejsPath] = currentViewData;
          previousOptions[ejsPath] = currentOptions;
        }
      });
    });
    firstFile = false;
  }

  browserWindow.loadURL(`ejs:///${ejspath}`, {
    extraHeaders: `
    currentViewData: ${JSON.stringify(data) || '{}'}
    currentOptions: ${JSON.stringify(options) || '{}'}`,
  });
}

export function render(window: Electron.BrowserWindow, rawEjs: string, data: oEjs.Data, options: oEjs.Options) {
  window.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(oEjs.render(rawEjs, data || {}, options || {}).toString())); // this could be impoved to have the same buffer as the other one e.g. have an extra header as a true of false with the keyword file so that location.reload would work maybe idk im drunk XD
}

exports.cache = oEjs.cache;
exports.delimiter = oEjs.delimiter;
exports.openDelimiter = oEjs.openDelimiter;
exports.closeDelimiter = oEjs.closeDelimiter;
exports.cache = oEjs.cache;
exports.fileLoader = oEjs.fileLoader;
exports.compile = oEjs.compile;
