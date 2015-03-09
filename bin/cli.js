#!/usr/bin/env node

var fs = require('fs');
var through2 = require('through2');
var minimist = require('minimist');
var stringifyObject = require('stringify-object');
var Kat = require('kat');

var convertCss = require('../index.js');

// ----------------------------------------------------------------------------
// Arguments
// ----------------------------------------------------------------------------
var cliArgs = minimist(process.argv.slice(2));

var inputs = cliArgs.input;

if (inputs) {
  inputs = Array.isArray(inputs) ? inputs : [ inputs ];
}

// Index 0 (file path) else stdin output arguments in remainder.
if (cliArgs._.length > 1) {
  throw new Error('Must have 0 or 1 output paths specified');
}

var output = cliArgs._[0] || null; // Remaining argument.

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
var stringifyResult = function (data) {
  return stringifyObject(data, {
    singleQuotes: cliArgs.quote !== 'double',
    indent: cliArgs.indentSize ? (new Array(cliArgs.indentSize)).join(' ') : '\t'
  });
};

// ----------------------------------------------------------------------------
// Streams
// ----------------------------------------------------------------------------
// Converter stream.
var _buffer = [];
var convertStream = through2(function (chunk, enc, callback) {
  _buffer.push(chunk.toString('utf8'));
  callback();
}, function (callback) {
  var data = _buffer.join('');
  var cssObj = convertCss(data);
  var converted = new Buffer(stringifyResult(cssObj));
  this.push(converted);
  callback();
});

// Encoding.
process.stdin.setEncoding('utf8');

// Input: Files or stdin.
var inputStream = process.stdin;

if (inputs) {
  inputStream = new Kat();
  inputs.forEach(function (input) {
    inputStream.add(input);
  });
}

// Output: File or stdout.
var outputStream = output ?
  fs.createWriteStream(output) :
  process.stdout;

// Pipe it!
inputStream
  .pipe(convertStream)
  .pipe(outputStream);
