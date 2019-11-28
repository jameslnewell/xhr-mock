import {matchMethod} from './matchMethod';
import {normaliseRequest} from '../normalise';

const methods = ['get', 'post', 'put', 'patch', 'delete'];

describe('matchMethod()', () => {
  test('returns undefined when the request method is not a match for the method pattern', () => {
    expect(
      matchMethod('foobar', normaliseRequest({method: 'get'})),
    ).toBeUndefined();
  });
  test('returns the method when the request method is an exact match for the string method pattern', () => {
    methods.forEach(method => {
      expect(
        matchMethod(method.toLowerCase(), normaliseRequest({method})),
      ).toEqual(method.toUpperCase());
      expect(
        matchMethod(method.toUpperCase(), normaliseRequest({method})),
      ).toEqual(method.toUpperCase());
    });
  });
  test('returns the method when the request method is a match for the wildcard method pattern', () => {
    methods.forEach(method => {
      expect(matchMethod('*', normaliseRequest({method}))).toEqual(
        method.toUpperCase(),
      );
    });
  });
});
