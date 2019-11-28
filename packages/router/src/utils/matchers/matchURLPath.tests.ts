import {matchURLPath} from './matchURLPath';
import {normaliseRequest} from '../normalise';

const req = normaliseRequest({
  url: 'http://localhost/user/jameslnewell',
});

const profilePath = '/user/jameslnewell';

describe('matchURLPath()', () => {
  test('returns undefined when the request url is not a match for the path pattern', () => {
    expect(matchURLPath('/foo/bar', req)).toBeUndefined();
  });

  test('returns the path when the request url is an exact match for the path pattern', () => {
    expect(matchURLPath('/user/jameslnewell', req)).toEqual({
      path: profilePath,
      params: {},
    });
  });

  test('returns the path when the request url is a match for the path pattern with a trailing slash', () => {
    expect(
      matchURLPath('/user/jameslnewell', {...req, url: `${req.url}/`}),
    ).toEqual({
      path: `${profilePath}/`,
      params: {},
    });
  });

  test('returns the path when the request url is a match for the regex path pattern', () => {
    expect(matchURLPath(/jameslnewell/, req)).toEqual({
      path: profilePath,
      params: {},
    });
  });

  test('returns the path and params when the request url is a match for the segment path pattern', () => {
    expect(matchURLPath('/user/:username', req)).toEqual({
      path: profilePath,
      params: {username: 'jameslnewell'},
    });
  });
});
