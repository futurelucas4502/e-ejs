'use strict';

import { app, protocol } from 'electron';
import path = require('path');
import oEjs = require('ejs');

app.whenReady().then(() => {
  protocol.registerFileProtocol('ejs', (request, callback) => {
    const url = request.url.substr(5);
    const file = { path: path.normalize(`${process.cwd()}/${url}`) };
    callback(file);
  });
});

export function renderFile(window: Electron.BrowserWindow, ejspath: string, data: oEjs.Data, options: oEjs.Options) {
  if (typeof data === undefined || data === undefined || data == null) {
    data = {};
  }
  if (typeof options === undefined || options === undefined || options == null || options === '') {
    options = {};
  }
  oEjs.renderFile(ejspath, data, options, (err, str) => {
    if (err) throw err;
    window.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(str), {
      baseURLForDataURL: 'ejs:/', // have to use this as `file://${__dirname}` is broken see here: https://github.com/electron/electron/issues/20700#issuecomment-573847842
    });
  });
}

export function render(window: Electron.BrowserWindow, rawEjs: string, data: oEjs.Data, options: oEjs.Options) {
  if (typeof data === undefined || data === undefined || data == null) {
    data = {};
  }
  if (typeof options === undefined || options === undefined || options == null || options === '') {
    options = {};
  }
  window.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(oEjs.render(rawEjs, data, options).toString()), {
    baseURLForDataURL: 'ejs:/', // have to use this as `file://${__dirname}` is broken see here: https://github.com/electron/electron/issues/20700#issuecomment-573847842
  });
}

exports.cache = oEjs.cache;
exports.delimiter = oEjs.delimiter;
exports.openDelimiter = oEjs.openDelimiter;
exports.closeDelimiter = oEjs.closeDelimiter;
exports.cache = oEjs.cache;
exports.fileLoader = oEjs.fileLoader;
exports.compile = oEjs.compile;
