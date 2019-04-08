'use strict';
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({__proto__: []} instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
exports.__esModule = true;
var MockEventTarget_1 = require('./MockEventTarget');
// @ts-ignore: https://github.com/jameslnewell/xhr-mock/issues/45
var MockXMLHttpRequestEventTarget = /** @class */ (function(_super) {
  __extends(MockXMLHttpRequestEventTarget, _super);
  function MockXMLHttpRequestEventTarget() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return MockXMLHttpRequestEventTarget;
})(MockEventTarget_1.MockEventTarget);
exports.MockXMLHttpRequestEventTarget = MockXMLHttpRequestEventTarget;
