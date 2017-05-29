import MockEventTarget from './MockEventTarget';

describe('MockEventTarget', () => {
  it('should only call the listeners for "event1"', () => {
    const target = new MockEventTarget();

    const listenerA = jest.fn();
    target.addEventListener('event1', listenerA);

    const listenerB = jest.fn();
    target.addEventListener('event2', listenerB);

    const listenerC = jest.fn();
    target.onevent1 = listenerC;

    const listenerD = jest.fn();
    target.onevent2 = listenerD;

    target.dispatchEvent({type: 'event1'});

    expect(listenerA.mock.calls).toHaveLength(1);
    expect(listenerB.mock.calls).toHaveLength(0);
    expect(listenerC.mock.calls).toHaveLength(1);
    expect(listenerD.mock.calls).toHaveLength(0);
  });

  it('should only call the listener for "event1" once when the listener has been added twice', () => {
    const target = new MockEventTarget();

    const listener = jest.fn();
    target.addEventListener('event1', listener);
    target.addEventListener('event1', listener);

    target.dispatchEvent({type: 'event1'});

    expect(listener.mock.calls).toHaveLength(1);
  });

  it('should not call the listener for "event1" when the listener has been removed for "event1"', () => {
    const target = new MockEventTarget();

    const listener = jest.fn();
    target.addEventListener('event1', listener);
    target.removeEventListener('event1', listener);

    target.dispatchEvent({type: 'event1'});

    expect(listener.mock.calls).toHaveLength(0);
  });

  it('should set the target', () => {
    const target = new MockEventTarget();

    target.addEventListener('event1', event => {
      expect(event.target).toBe(target);
      expect(event.currentTarget).toBe(target);
    });

    target.dispatchEvent('event1');
  });

  it('should set this', () => {
    const target = new MockEventTarget();

    target.addEventListener('event1', function(event) {
      expect(this).toBe(target);
    });

    target.dispatchEvent('event1');
  });
});
