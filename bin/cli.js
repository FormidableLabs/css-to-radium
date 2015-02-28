#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var stringifyObject = require('stringify-object');

var convertCss = require('../index.js');

var sourceCss = process.argv[2];
var destJs = process.argv[3];

var writeJS = function (convertedData) {
  var stringData = "module.exports = " + stringifyObject(convertedData) + ";";

  fs.writeFile(destJs, stringData, function (err) {
    if (err) throw err;
  });
};

fs.readFile(sourceCss, 'utf-8', function (err, data) {
  if (err) throw err;

  convertCss(data, writeJS);
});
