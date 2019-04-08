'use strict';
exports.__esModule = true;
var MockEvent_1 = require('./MockEvent');
var MockEventTarget_1 = require('./MockEventTarget');
describe('MockEventTarget', function() {
  it('should call the listener once when added once', function() {
    var target = new MockEventTarget_1.MockEventTarget();
    var listener = jest.fn();
    target.addEventListener('event1', listener);
    target.dispatchEvent(new MockEvent_1.MockEvent('event1'));
    expect(listener.mock.calls).toHaveLength(1);
  });
  it('should call the listener once when added multiple times', function() {
    var target = new MockEventTarget_1.MockEventTarget();
    var listener = jest.fn();
    target.addEventListener('event1', listener);
    target.addEventListener('event1', listener);
    target.dispatchEvent(new MockEvent_1.MockEvent('event1'));
    expect(listener.mock.calls).toHaveLength(1);
  });
  it('should call the correct listener when multiple listeners are added', function() {
    var target = new MockEventTarget_1.MockEventTarget();
    var listener1 = jest.fn();
    target.addEventListener('event1', listener1);
    var listener2 = jest.fn();
    target.addEventListener('event2', listener2);
    target.dispatchEvent(new MockEvent_1.MockEvent('event1'));
    expect(listener1.mock.calls).toHaveLength(1);
    expect(listener2.mock.calls).toHaveLength(0);
  });
  it('should not call the listener when removed', function() {
    var target = new MockEventTarget_1.MockEventTarget();
    var listener = jest.fn();
    target.addEventListener('event1', listener);
    target.addEventListener('event1', listener);
    target.removeEventListener('event1', listener);
    target.dispatchEvent(new MockEvent_1.MockEvent('event1'));
    expect(listener.mock.calls).toHaveLength(0);
  });
  it('should set this', function() {
    expect.assertions(1);
    var target = new MockEventTarget_1.MockEventTarget();
    target.addEventListener('event1', function(event) {
      expect(this).toBe(target);
    });
    target.dispatchEvent(new MockEvent_1.MockEvent('event1'));
  });
  it('should set the target and currentTarget', function() {
    expect.assertions(2);
    var target = new MockEventTarget_1.MockEventTarget();
    target.addEventListener('event1', function(event) {
      expect(event.target).toBe(target);
      expect(event.currentTarget).toBe(target);
    });
    target.dispatchEvent(new MockEvent_1.MockEvent('event1'));
  });
  it('should set this when an `onevent1` is called', function() {
    expect.assertions(1);
    var target = new MockEventTarget_1.MockEventTarget();
    target.onevent1 = function(event) {
      expect(this).toBe(target);
    };
    target.dispatchEvent(new MockEvent_1.MockEvent('event1'));
  });
});
