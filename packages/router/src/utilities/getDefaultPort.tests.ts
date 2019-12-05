import {URL} from 'whatwg-url';
import {getDefaultPort} from './getDefaultPort';

describe('getDefaultPort()', () => {
  test('should return undefined when no port is spectified and the protocol is file', () => {
    expect(getDefaultPort(new URL('file://abcd'))).toBeUndefined();
  });
  test('should return 80 when no port is spectified and the protocol is http', () => {
    expect(getDefaultPort(new URL('http://www.example.com/'))).toEqual(80);
  });
  test('should return 443 when no port is spectified and the protocol is https', () => {
    expect(getDefaultPort(new URL('https://www.example.com/'))).toEqual(443);
  });
  test('should return 8888 when the port is spectified', () => {
    expect(getDefaultPort(new URL('http://www.example.com:8888/'))).toEqual(
      8888,
    );
    expect(getDefaultPort(new URL('https://www.example.com:8888/'))).toEqual(
      8888,
    );
  });
});
