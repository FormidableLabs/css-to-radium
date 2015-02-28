var _ = require('lodash');
var postcss = require('postcss');
var camelCase = require('camelcase');

var convertValue = function (value) {
  var result = value;
  var resultNumber = Number(result);

  // Handle single pixel values (font-size: 16px)
  if (result.indexOf(' ') === -1 && result.indexOf('px') !== -1) {
    result = parseInt(result.replace('px', ''), 10);
  // Handle numeric values
  } else if (_.isNaN(resultNumber) === false) {
    result = resultNumber;
  }

  return result;
};

var convertProp = function (prop) {
  var result = camelCase(prop);

  // Handle vendor prefixes
  if (prop.indexOf('-webkit') === 0) {
    result = result.replace('webkit', 'Webkit');
  } else if (prop.indexOf('-moz') === 0) {
    result = result.replace('moz', 'Moz');
  } else if (prop.indexOf('-o') === 0) {
    result = result.replace('o', 'O');
  }

  return camelCase(result);
};

var convertDecl = function (decl) {
  return {
    property: convertProp(decl.prop),
    value: convertValue(decl.value)
  };
};

var convertRule = function (rule) {
  return {
    selector: rule.selector,
    declarations: _.transform(rule.nodes, function (convertedDecls, decl) {
      var convertedDecl = convertDecl(decl);

      convertedDecls[convertedDecl.property] = convertedDecl.value;
    }, {})
  };
};

var convertCss = function (sourceCss, cb) {
  var result = _.chain(postcss.parse(sourceCss).nodes)
    .filter({ type: 'rule' })
    .transform(function (convertedObj, rule) {
      var convertedRule = convertRule(rule);

      convertedObj[convertedRule.selector] = convertedRule.declarations;
    }, {})
    .value();

  cb(result);
};

module.exports = convertCss;
