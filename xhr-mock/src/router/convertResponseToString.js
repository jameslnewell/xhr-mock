'use strict';
exports.__esModule = true;
function convertResponseToString(res) {
  var headers = Object.keys(res.headers).map(function(name) {
    return name + ': ' + res.headers[name];
  });
  var bodyLine = '\n' + (res.body ? res.body : '');
  return (
    'HTTP/' +
    res.version +
    ' ' +
    res.status +
    ' ' +
    res.reason +
    '\n' +
    (headers.length ? headers.join('\n') + '\n' : '') +
    bodyLine
  );
}
exports.convertResponseToString = convertResponseToString;
