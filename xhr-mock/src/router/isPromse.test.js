'use strict';
exports.__esModule = true;
var isPromise_1 = require('./isPromise');
describe('isPromise()', function() {
  it('should return true', function() {
    expect(isPromise_1.isPromise(Promise.resolve())).toBeTruthy();
    // expect(isPromise(Promise.reject(new Error()))).toBeTruthy();
    expect(
      isPromise_1.isPromise(
        new Promise(function() {
          /* do nothing */
        })
      )
    ).toBeTruthy();
  });
  it('should return false', function() {
    expect(isPromise_1.isPromise(undefined)).toBeFalsy();
    expect(isPromise_1.isPromise(null)).toBeFalsy();
    expect(isPromise_1.isPromise('')).toBeFalsy();
    expect(isPromise_1.isPromise('hello')).toBeFalsy();
    expect(isPromise_1.isPromise(0)).toBeFalsy();
    expect(isPromise_1.isPromise(true)).toBeFalsy();
    expect(isPromise_1.isPromise(false)).toBeFalsy();
    expect(isPromise_1.isPromise(['foo'])).toBeFalsy();
    expect(isPromise_1.isPromise({foo: 'bar'})).toBeFalsy();
  });
});
