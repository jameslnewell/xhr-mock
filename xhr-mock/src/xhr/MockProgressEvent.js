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
var MockEvent_1 = require('./MockEvent');
var MockProgressEvent = /** @class */ (function(_super) {
  __extends(MockProgressEvent, _super);
  function MockProgressEvent(type, eventInitDict) {
    var _this = _super.call(this, type, eventInitDict) || this;
    if (eventInitDict) {
      var _a = eventInitDict.lengthComputable,
        lengthComputable = _a === void 0 ? false : _a,
        _b = eventInitDict.loaded,
        loaded = _b === void 0 ? 0 : _b,
        _c = eventInitDict.total,
        total = _c === void 0 ? 0 : _c;
      _this.lengthComputable = lengthComputable;
      _this.loaded = loaded;
      _this.total = total;
    }
    return _this;
  }
  MockProgressEvent.prototype.initProgressEvent = function(
    typeArg,
    canBubbleArg,
    cancelableArg,
    lengthComputableArg,
    loadedArg,
    totalArg
  ) {
    throw new Error();
  };
  return MockProgressEvent;
})(MockEvent_1.MockEvent);
exports.MockProgressEvent = MockProgressEvent;
