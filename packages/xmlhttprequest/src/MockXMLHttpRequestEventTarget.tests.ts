import {MockEvent} from './MockEvent';
import {MockXMLHttpRequestEventTarget} from './MockXMLHttpRequestEventTarget';

const event1Type = 'loadstart' as const;
const event2Type = 'loadend' as const;

describe('MockXMLHttpRequestEventTarget', () => {
  test('should call the listener once when added once', () => {
    const target = new MockXMLHttpRequestEventTarget();

    const listener = jest.fn();
    target.addEventListener(event1Type, listener);

    target.dispatchEvent(new MockEvent(event1Type));

    expect(listener.mock.calls).toHaveLength(1);
  });

  test('should call the listener once when added multiple times', () => {
    const target = new MockXMLHttpRequestEventTarget();

    const listener = jest.fn();
    target.addEventListener(event1Type, listener);
    target.addEventListener(event1Type, listener);

    target.dispatchEvent(new MockEvent(event1Type));

    expect(listener.mock.calls).toHaveLength(1);
  });

  test('should call the correct listener when multiple listeners are added', () => {
    const target = new MockXMLHttpRequestEventTarget();

    const listener1 = jest.fn();
    target.addEventListener(event1Type, listener1);
    const listener2 = jest.fn();
    target.addEventListener(event2Type, listener2);

    target.dispatchEvent(new MockEvent(event1Type));

    expect(listener1.mock.calls).toHaveLength(1);
    expect(listener2.mock.calls).toHaveLength(0);
  });

  test('should not call the listener when removed', () => {
    const target = new MockXMLHttpRequestEventTarget();

    const listener = jest.fn();
    target.addEventListener(event1Type, listener);
    target.addEventListener(event1Type, listener);
    target.removeEventListener(event1Type, listener);

    target.dispatchEvent(new MockEvent(event1Type));

    expect(listener.mock.calls).toHaveLength(0);
  });

  test('should set this', () => {
    expect.assertions(1);
    const target = new MockXMLHttpRequestEventTarget();

    target.addEventListener(event1Type, function () {
      expect(this).toBe(target);
    });

    target.dispatchEvent(new MockEvent(event1Type));
  });

  test('should set the target and currentTarget', () => {
    expect.assertions(2);
    const target = new MockXMLHttpRequestEventTarget();

    target.addEventListener(event1Type, (event) => {
      expect(event.target).toBe(target);
      expect(event.currentTarget).toBe(target);
    });

    target.dispatchEvent(new MockEvent(event1Type));
  });

  test('should set this when an a handler is called', () => {
    expect.assertions(1);
    const target = new MockXMLHttpRequestEventTarget();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target.onloadstart = function () {
      expect(this).toBe(target);
    };

    target.dispatchEvent(new MockEvent(event1Type));
  });

  test('should call onabort', () => {
    const target = new MockXMLHttpRequestEventTarget();

    const listener = jest.fn();
    target.onabort = listener;

    target.dispatchEvent(new MockEvent('abort'));
    expect(listener.mock.calls).toHaveLength(1);
  });
});
