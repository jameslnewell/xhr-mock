'use strict';
exports.__esModule = true;
function isPromise(val) {
  return val && typeof val.then !== 'undefined';
}
exports.isPromise = isPromise;
