import {MockEvent} from './MockEvent';
import {MockXMLHttpRequestEventTarget} from './MockXMLHttpRequestEventTarget';

describe('MockXMLHttpRequestEventTarget', () => {
  it('should call onabort', () => {
    const target = new MockXMLHttpRequestEventTarget();

    const listener = jest.fn();
    target.onabort = listener;

    target.dispatchEvent(new MockEvent('abort'));

    expect(listener.mock.calls).toHaveLength(1);
  });
});
