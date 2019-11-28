import {matchURL} from './matchURL';
import {normaliseRequest} from '../normalise';

const req = normaliseRequest({
  url: 'https://example.com:8888/user/jameslnewell?foo=bar&bar=foo',
});

describe('matchURL()', () => {
  test('returns undefined when the request url is not a match for the protocol pattern', () => {
    expect(matchURL({protocol: 'file:'}, req)).toBeUndefined();
  });

  test('returns the url when the request url is a match for the protocol pattern', () => {
    expect(matchURL({protocol: 'https:'}, req)).toEqual({protocol: 'https:'});
  });

  test('returns undefined when the request url is not a match for the host pattern', () => {
    expect(matchURL({host: 'localhost'}, req)).toBeUndefined();
  });

  test('returns the url when the request url is a match for the host pattern', () => {
    expect(matchURL({host: 'example.com'}, req)).toEqual({host: 'example.com'});
  });

  test('returns undefined when the request url is not a match for the port pattern', () => {
    expect(matchURL({port: 80}, req)).toBeUndefined();
  });

  test('returns the url when the request url is a match for the port pattern', () => {
    expect(matchURL({port: 8888}, req)).toEqual({host: 8888});
  });

  test('returns undefined when the request url is not a match for the path pattern', () => {
    expect(matchURL({path: '/foo/bar'}, req)).toBeUndefined();
  });

  test('returns the url when the request url is a match for the path pattern', () => {
    expect(matchURL({path: '/user/:username'}, req)).toEqual({
      path: '/user/jameslnewell',
      params: {username: 'jameslnewell'},
    });
  });

  test('returns undefined when the request url is not a match for the query pattern', () => {
    expect(matchURL({query: {blah: 'blah'}}, req)).toBeUndefined();
  });

  test('returns the url when the request url is a match for the query pattern', () => {
    expect(matchURL({query: {foo: 'bar'}}, req)).toEqual({query: {foo: 'bar'}});
  });
});
