import {MockEvent} from './MockEvent';
import {MockXMLHttpRequestEventTarget} from './MockXMLHttpRequestEventTarget';

describe('MockXMLHttpRequestEventTarget', () => {
  it('should call the listener once when added once', () => {
    const target = new MockXMLHttpRequestEventTarget();

    const listener = jest.fn();
    target.addEventListener('event1', listener);

    target.dispatchEvent(new MockEvent('event1'));

    expect(listener.mock.calls).toHaveLength(1);
  });

  it('should call the listener once when added multiple times', () => {
    const target = new MockXMLHttpRequestEventTarget();

    const listener = jest.fn();
    target.addEventListener('event1', listener);
    target.addEventListener('event1', listener);

    target.dispatchEvent(new MockEvent('event1'));

    expect(listener.mock.calls).toHaveLength(1);
  });

  it('should call the correct listener when multiple listeners are added', () => {
    const target = new MockXMLHttpRequestEventTarget();

    const listener1 = jest.fn();
    target.addEventListener('event1', listener1);
    const listener2 = jest.fn();
    target.addEventListener('event2', listener2);

    target.dispatchEvent(new MockEvent('event1'));

    expect(listener1.mock.calls).toHaveLength(1);
    expect(listener2.mock.calls).toHaveLength(0);
  });

  it('should not call the listener when removed', () => {
    const target = new MockXMLHttpRequestEventTarget();

    const listener = jest.fn();
    target.addEventListener('event1', listener);
    target.addEventListener('event1', listener);
    target.removeEventListener('event1', listener);

    target.dispatchEvent(new MockEvent('event1'));

    expect(listener.mock.calls).toHaveLength(0);
  });

  it('should set this', () => {
    expect.assertions(1);
    const target = new MockXMLHttpRequestEventTarget();

    target.addEventListener('event1', function() {
      expect(this).toBe(target);
    });

    target.dispatchEvent(new MockEvent('event1'));
  });

  it('should set the target and currentTarget', () => {
    expect.assertions(2);
    const target = new MockXMLHttpRequestEventTarget();

    target.addEventListener('event1', event => {
      expect(event.target).toBe(target);
      expect(event.currentTarget).toBe(target);
    });

    target.dispatchEvent(new MockEvent('event1'));
  });

  it('should set this when an `onevent1` is called', () => {
    expect.assertions(1);
    const target = new MockXMLHttpRequestEventTarget();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (target as any).onevent1 = function() {
      expect(this).toBe(target);
    };

    target.dispatchEvent(new MockEvent('event1'));
  });
  it('should call onabort', () => {
    const target = new MockXMLHttpRequestEventTarget();

    const listener = jest.fn();
    target.onabort = listener;

    target.dispatchEvent(new MockEvent('abort'));

    expect(listener.mock.calls).toHaveLength(1);
  });
});
