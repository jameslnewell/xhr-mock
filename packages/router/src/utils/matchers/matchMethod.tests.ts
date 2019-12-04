import {matchMethod} from './matchMethod';
import {normaliseRequest} from '../normalise';

const methods = ['get', 'post', 'put', 'patch', 'delete'];

describe('matchMethod()', () => {
  test('returns false when the request method does not match the pattern', () => {
    expect(
      matchMethod('foobar', normaliseRequest({method: 'get'})),
    ).toBeFalsy();
  });
  test('returns true when the request method does match the pattern', () => {
    methods.forEach(method => {
      expect(
        matchMethod(method.toLowerCase(), normaliseRequest({method})),
      ).toBeTruthy();
      expect(
        matchMethod(method.toUpperCase(), normaliseRequest({method})),
      ).toBeTruthy();
    });
  });
  test('returns true when the request method matches the wildcard pattern', () => {
    methods.forEach(method => {
      expect(matchMethod('*', normaliseRequest({method}))).toBeTruthy();
    });
  });
});
