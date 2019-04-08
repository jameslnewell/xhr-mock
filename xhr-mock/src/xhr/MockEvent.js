'use strict';
exports.__esModule = true;
var MockEvent = /** @class */ (function() {
  function MockEvent(type, eventInitDict) {
    this.eventPhase = 0;
    this.type = type || '';
    if (eventInitDict) {
      var _a = eventInitDict.scoped,
        scoped = _a === void 0 ? false : _a,
        _b = eventInitDict.bubbles,
        bubbles = _b === void 0 ? false : _b,
        _c = eventInitDict.cancelable,
        cancelable = _c === void 0 ? false : _c;
      this.scoped = scoped;
      this.bubbles = bubbles;
      this.cancelable = cancelable;
    }
  }
  MockEvent.prototype.initEvent = function(eventTypeArg, canBubbleArg, cancelableArg) {
    throw new Error();
  };
  MockEvent.prototype.preventDefault = function() {
    throw new Error();
  };
  MockEvent.prototype.stopImmediatePropagation = function() {
    throw new Error();
  };
  MockEvent.prototype.stopPropagation = function() {
    throw new Error();
  };
  MockEvent.prototype.deepPath = function() {
    throw new Error();
  };
  return MockEvent;
})();
exports.MockEvent = MockEvent;
