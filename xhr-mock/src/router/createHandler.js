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
var url_1 = require('url');
var pathToRegExp = require('path-to-regexp');
function getURIParams(path, pattern) {
  var keys = [];
  var regexp = pathToRegExp(pattern, keys);
  var match = regexp.exec(path);
  if (match) {
    return keys.reduce(function(params, key, i) {
      var value = match[i + 1];
      if (value) {
        value = decodeURIComponent(value);
        if (key.repeat) {
          params[key.name] = value;
        } else {
          params[key.name] = value;
        }
      }
      return params;
    }, {});
  } else {
    return undefined;
  }
}
function createHandler(method, uri, handlerOrResponse) {
  return function(req, ctx) {
    var uriParams;
    // match the method
    if (method !== '*' && method.toLowerCase() !== req.method.toLowerCase()) {
      return undefined;
    }
    // parse the uri
    if (uri instanceof RegExp) {
      // TODO: regexp should be compared to the full URL
      uri.lastIndex = 0; // reset the state of the regexp since it will be reused for the next request
      if (!uri.test(req.uri)) {
        return undefined;
      }
    } else {
      var parsedMatchURI = url_1.parse(uri);
      var parsedRequestURI = url_1.parse(uri);
      // TODO: match the host
      // if (req.headers.host && req.headers.host !== parsedURI.host) {
      //   return undefined;
      // }
      // match the URI path
      uriParams = getURIParams(parsedRequestURI.pathname, parsedMatchURI.pathname);
      if (!uriParams) {
        return undefined;
      }
    }
    if (typeof handlerOrResponse === 'function') {
      // create a new request with the params matched from the path
      var reqWithPathParams = __assign({}, req, {params: __assign({}, uriParams)});
      return handlerOrResponse(reqWithPathParams, ctx);
    } else {
      return handlerOrResponse;
    }
  };
}
exports.createHandler = createHandler;
