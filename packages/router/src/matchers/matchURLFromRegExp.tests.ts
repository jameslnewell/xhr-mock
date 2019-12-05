import {matchURLFromRegExp} from './matchURLFromRegExp';
import {normaliseRequest} from '../utilities/normalise';

describe('matchURLFromRegExp()', () => {
  test('returns false when the request url does not match the regexp', () => {
    expect(matchURLFromRegExp(/abcd/, normaliseRequest({}))).toBeFalsy();
  });
  test('returns true when the request url matches the regexp', () => {
    expect(
      matchURLFromRegExp(/abcd/, normaliseRequest({url: '/abcdefgh'})),
    ).toBeTruthy();
  });
});
