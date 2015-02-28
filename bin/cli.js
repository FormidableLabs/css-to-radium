#!/usr/bin/env node

var fs = require('fs');

var minimist = require('minimist');
var stringifyObject = require('stringify-object');

var convertCss = require('../index.js');

var sourceCss = process.argv[2];
var destJs = process.argv[3];

var cliArgs = minimist(process.argv);

var getTabString = function (tabWidth) {
  var result = '';

  for (var i = 0; i < tabWidth; i++) {
    result += ' ';
  }

  return result;
};

var stringifyResult = function (data) {
  return stringifyObject(data, {
    singleQuotes: cliArgs.quote === 'double' ? false : true,
    indent: cliArgs.indentSize ? getTabString(cliArgs.indentSize) : '\t'
  });
};

var writeJS = function (convertedData) {
  var stringData = "module.exports = " + stringifyResult(convertedData) + ";";

  if (destJs) {
    fs.writeFile(destJs, stringData, function (err) {
      if (err) throw err;
    });

    return;
  }

  console.log(stringData);
};

fs.readFile(sourceCss, 'utf-8', function (err, data) {
  if (err) throw err;

  convertCss(data, writeJS);
});
