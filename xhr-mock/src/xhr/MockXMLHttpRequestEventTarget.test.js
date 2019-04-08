'use strict';
exports.__esModule = true;
var MockEvent_1 = require('./MockEvent');
var MockXMLHttpRequestEventTarget_1 = require('./MockXMLHttpRequestEventTarget');
describe('MockXMLHttpRequestEventTarget', function() {
  it('should call onabort', function() {
    var target = new MockXMLHttpRequestEventTarget_1.MockXMLHttpRequestEventTarget();
    var listener = jest.fn();
    target.onabort = listener;
    target.dispatchEvent(new MockEvent_1.MockEvent('abort'));
    expect(listener.mock.calls).toHaveLength(1);
  });
});
