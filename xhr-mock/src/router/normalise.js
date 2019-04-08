'use strict';
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
exports.__esModule = true;
var statuses = require('statuses');
function normaliseMethod(method) {
  return method.toUpperCase();
}
function normaliseHeaders(headers) {
  return Object.keys(headers).reduce(function(newHeaders, name) {
    newHeaders[name.toLowerCase()] = headers[name];
    return newHeaders;
  }, {});
}
function getReasonById(status) {
  return statuses[status] || '';
}
function normaliseRequest(req) {
  return __assign({version: '1.1', uri: '/', body: undefined}, req, {
    method: normaliseMethod(req.method || 'GET'),
    headers: normaliseHeaders(req.headers || {})
  });
}
exports.normaliseRequest = normaliseRequest;
function normaliseResponse(res) {
  return __assign({version: '1.1', status: 200, reason: getReasonById(res.status || 200), body: undefined}, res, {
    headers: normaliseHeaders(res.headers || {})
  });
}
exports.normaliseResponse = normaliseResponse;
