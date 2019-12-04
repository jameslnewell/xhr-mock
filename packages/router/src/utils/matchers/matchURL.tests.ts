import {matchURL} from './matchURL';
import {normaliseRequest} from '../normalise';

const req = normaliseRequest({
  url: 'https://example.com:8888/user/jameslnewell?foo=bar&bar=foo',
});

describe('matchURL()', () => {
  test('returns false when the request url does not match the protocol pattern', () => {
    expect(matchURL({protocol: 'file:'}, req)).toBeFalsy();
  });

  test('returns the url when the request url matches the protocol pattern', () => {
    expect(matchURL({protocol: 'https:'}, req)).toEqual(
      expect.objectContaining({protocol: 'https:'}),
    );
  });

  test('returns false when the request url does not match the host pattern', () => {
    expect(matchURL({host: 'localhost'}, req)).toBeFalsy();
  });

  test('returns the url when the request url matches the host pattern', () => {
    expect(matchURL({host: 'example.com'}, req)).toEqual(
      expect.objectContaining({host: 'example.com'}),
    );
  });

  test('returns false when the request url does not match the port pattern', () => {
    expect(matchURL({port: 80}, req)).toBeFalsy();
  });

  test('returns the url when the request url matches the port pattern', () => {
    expect(matchURL({port: 8888}, req)).toEqual(
      expect.objectContaining({port: 8888}),
    );
  });

  test('returns false when the request url does not match the path pattern', () => {
    expect(matchURL({path: '/foo/bar'}, req)).toBeUndefined();
  });

  test('returns the url when the request url matches the path pattern', () => {
    expect(matchURL({path: '/user/:username'}, req)).toEqual(
      expect.objectContaining({
        path: '/user/jameslnewell',
        params: {username: 'jameslnewell'},
      }),
    );
  });

  test('returns false when the request url does not match the query pattern', () => {
    expect(matchURL({query: {blah: 'blah'}}, req)).toBeUndefined();
  });

  test('returns the url when the request url matches the query pattern', () => {
    expect(matchURL({query: {foo: 'bar'}}, req)).toEqual(
      expect.objectContaining({query: {foo: 'bar'}}),
    );
  });
});
