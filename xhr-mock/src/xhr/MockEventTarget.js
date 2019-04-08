'use strict';
exports.__esModule = true;
var MockEventTarget = /** @class */ (function() {
  function MockEventTarget() {
    this.listeners = {};
  }
  MockEventTarget.prototype.addEventListener = function(type, listener, options) {
    this.listeners = this.listeners || {};
    if (!listener) {
      return;
    }
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    //handleEvent
    if (this.listeners[type].indexOf(listener) === -1) {
      this.listeners[type].push(listener);
    }
  };
  MockEventTarget.prototype.removeEventListener = function(type, listener, options) {
    this.listeners = this.listeners || {};
    if (!listener) {
      return;
    }
    if (!this.listeners[type]) {
      return;
    }
    var index = this.listeners[type].indexOf(listener);
    if (index !== -1) {
      this.listeners[type].splice(index, 1);
    }
  };
  MockEventTarget.prototype.dispatchEvent = function(event) {
    var _this = this;
    this.listeners = this.listeners || {};
    //set the event target
    event.target = this;
    event.currentTarget = this;
    //call any built-in listeners
    //FIXME: the listener should be added on set
    var method = this['on' + event.type];
    if (method) {
      method.call(this, event);
    }
    if (!this.listeners[event.type]) {
      return true;
    }
    this.listeners[event.type].forEach(function(listener) {
      if (typeof listener === 'function') {
        listener.call(_this, event);
      } else {
        listener.handleEvent.call(_this, event);
      }
    });
    return true; //TODO: return type based on .cancellable and .preventDefault()
  };
  return MockEventTarget;
})();
exports.MockEventTarget = MockEventTarget;
