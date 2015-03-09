#!/usr/bin/env node

var fs = require('fs');
var through2 = require('through2');

var minimist = require('minimist');
var stringifyObject = require('stringify-object');

var convertCss = require('../index.js');

// ----------------------------------------------------------------------------
// Arguments
// ----------------------------------------------------------------------------
var cliArgs = minimist(process.argv);

// TODO: DOCUMENT THIS.
// TODO: Consider multiple flags instead for multiple inputs?
var inputs = (cliArgs.input || '').split(',');

// TODO: Handle 2+ inputs.
var inputs = inputs[0] || null;

// First two args are 'node' and script path.
// Index 3 (file path) else stdin output arguments in remainder.
if (cliArgs._.length > 3) {
  throw new Error('Must have 0 or 1 output paths specified');
}
var output = cliArgs._[2] || null; // Remaining argument.

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
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
  var converted = new Buffer(JSON.stringify(cssObj));
  this.push(converted);
  callback();
});

// Encoding.
process.stdin.setEncoding('utf8');

// Input: File or stdin.
var inputStream = inputs ?
  fs.createReadStream(inputs, { encoding: 'utf8' }) :
  process.stdin;

// Output: File or stdout.
var outputStream = output ?
  fs.createWriteStream(output) :
  process.stdout;

// Pipe it!
inputStream
  .pipe(convertStream)
  .pipe(outputStream);
