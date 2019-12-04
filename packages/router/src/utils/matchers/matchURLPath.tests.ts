import {matchURLPath} from './matchURLPath';
import {normaliseRequest} from '../normalise';

const req = normaliseRequest({
  url: 'http://localhost/user/jameslnewell',
});

const profilePath = '/user/jameslnewell';

describe('matchURLPath()', () => {
  test('returns undefined when the request url does not match the path pattern', () => {
    expect(matchURLPath('/foo/bar', req)).toBeUndefined();
  });

  test('returns the params when the request url does match the string path pattern exactly', () => {
    expect(matchURLPath('/user/jameslnewell', req)).toEqual({
      path: '/user/jameslnewell',
      params: {},
    });
  });

  test('returns the params when the request url does match the string path pattern with a trailing slash', () => {
    expect(
      matchURLPath('/user/jameslnewell', {...req, url: `${req.url}/`}),
    ).toEqual({
      path: '/user/jameslnewell/',
      params: {},
    });
  });

  test('returns the params when the request url does match the regexp path pattern', () => {
    expect(matchURLPath(/jameslnewell/, req)).toEqual({
      path: '/user/jameslnewell',
      params: {},
    });
  });

  test('returns the params when the request url does match the segment path pattern', () => {
    expect(matchURLPath('/user/:username', req)).toEqual({
      path: '/user/jameslnewell',
      params: {username: 'jameslnewell'},
    });
  });
});
