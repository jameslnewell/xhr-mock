import {MockURL, parseURL, formatURL} from './MockURL';

const valid: {[key: string]: MockURL} = {
  'http://james@localhost:8080/api/user/123?foo=bar': {
    protocol: 'http',
    username: 'james',
    host: 'localhost',
    port: 8080,
    path: '/api/user/123',
    query: {
      foo: 'bar'
    }
  },

  'http://james:abc123@localhost:8080/api/user/123?foo=bar': {
    protocol: 'http',
    username: 'james',
    password: 'abc123',
    host: 'localhost',
    port: 8080,
    path: '/api/user/123',
    query: {
      foo: 'bar'
    }
  },

  'http://localhost:8080/api/user/123?foo=bar': {
    protocol: 'http',
    host: 'localhost',
    port: 8080,
    path: '/api/user/123',
    query: {
      foo: 'bar'
    }
  },

  '/api/user/123?foo=bar': {
    path: '/api/user/123',
    query: {
      foo: 'bar'
    }
  }
};

describe('MockURL', () => {
  describe('parseURL()', () => {
    it('should return a valid object', () => {
      Object.keys(valid).forEach(url => {
        expect(parseURL(url)).toEqual(valid[url]);
      });
    });
  });

  describe('formatURL()', () => {
    it('should return a valid URL', () => {
      Object.keys(valid).forEach(url => {
        expect(formatURL(valid[url])).toEqual(url);
      });
    });
  });
});
