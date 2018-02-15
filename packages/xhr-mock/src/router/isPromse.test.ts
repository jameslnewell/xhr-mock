import isPromise from './isPromise';

describe('isPromise()', () => {
  it('should return true', () => {
    expect(isPromise(Promise.resolve())).toBeTruthy();
    // expect(isPromise(Promise.reject())).toBeTruthy();
    expect(
      isPromise(
        new Promise(() => {
          /* do nothing */
        })
      )
    ).toBeTruthy();
  });

  it('should return false', () => {
    expect(isPromise(undefined)).toBeFalsy();
    expect(isPromise(null)).toBeFalsy();
    expect(isPromise('')).toBeFalsy();
    expect(isPromise('hello')).toBeFalsy();
    expect(isPromise(0)).toBeFalsy();
    expect(isPromise(true)).toBeFalsy();
    expect(isPromise(false)).toBeFalsy();
    expect(isPromise(['foo'])).toBeFalsy();
    expect(isPromise({foo: 'bar'})).toBeFalsy();
  });
});
