'use strict';
exports.__esModule = true;
function convertRequestToString(req) {
  var headers = Object.keys(req.headers).map(function(name) {
    return name + ': ' + req.headers[name];
  });
  var bodyLine = '\n' + (req.body ? req.body : '');
  return (
    req.method +
    ' ' +
    req.uri +
    ' HTTP/' +
    req.version +
    '\n' +
    (headers.length ? headers.join('\n') + '\n' : '') +
    bodyLine
  );
}
exports.convertRequestToString = convertRequestToString;
