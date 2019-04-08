'use strict';
exports.__esModule = true;
var convertRequestToString_1 = require('./convertRequestToString');
var convertResponseToString_1 = require('./convertResponseToString');
function indentLines(string, indent) {
  return string
    .split('\n')
    .map(function(line, index) {
      return Array(indent + 1).join(' ') + line;
    })
    .join('\n');
}
function formatRequest(req) {
  return indentLines(convertRequestToString_1.convertRequestToString(req).trim(), 4);
}
function formatResponse(res) {
  return indentLines(convertResponseToString_1.convertResponseToString(res).trim(), 4);
}
function formatError(err) {
  return indentLines((err && err.stack) || (err && err.message) || 'Error: ' + err, 4);
}
function formatMessage(msg, _a) {
  var req = _a.req,
    res = _a.res,
    err = _a.err;
  return (
    'xhr-mock: ' +
    msg +
    '\n\n' +
    formatRequest(req) +
    '\n' +
    (res ? '\n' + formatResponse(res) : '') +
    (err ? '\n' + formatError(err) : '') +
    '\n'
  );
}
exports.formatMessage = formatMessage;
