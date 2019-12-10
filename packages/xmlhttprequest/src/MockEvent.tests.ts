import {MockEvent} from './MockEvent';

describe('MockEvent', () => {
  test('should be cancelled when cancelable and preventDefault() is called', () => {
    const event = new MockEvent('test', {cancelable: true});
    expect(event.defaultPrevented).toBeFalsy();
    event.preventDefault();
    expect(event.defaultPrevented).toBeTruthy();
  });

  test('should not be cancelled when cancelable and preventDefault() is not called', () => {
    const event = new MockEvent('test', {cancelable: true});
    expect(event.defaultPrevented).toBeFalsy();
  });

  test('should not be cancelled when not cancelable and preventDefault() is called', () => {
    const event = new MockEvent('test', {cancelable: false});
    expect(event.defaultPrevented).toBeFalsy();
    event.preventDefault();
    expect(event.defaultPrevented).toBeFalsy();
  });

  test('should not be cancelled when not cancelable and preventDefault() is not called', () => {
    const event = new MockEvent('test', {cancelable: false});
    expect(event.defaultPrevented).toBeFalsy();
  });
});
