import {getRedirectRequest} from './getRedirectRequest';
import {normaliseResponse} from './normalise';
import {putFoobarRequest, barfooURL} from '../__tests__/fixtures';

describe('getRedirectRequest()', () => {
  test('returns undefined when the response status not 3xx', () => {
    const response = normaliseResponse({
      headers: {
        location: barfooURL,
      },
    });
    expect(getRedirectRequest(putFoobarRequest, response)).toBeUndefined();
  });

  test('returns undefined when the response does not contain a location header', () => {
    const response = normaliseResponse({status: 301});
    expect(getRedirectRequest(putFoobarRequest, response)).toBeUndefined();
  });

  [301, 302, 307, 308].forEach(status => {
    test(`returns a request with the modified URL when the response status is ${status} and has a location header set`, () => {
      const response = normaliseResponse({
        status,
        headers: {
          location: barfooURL,
        },
      });
      expect(getRedirectRequest(putFoobarRequest, response)).toEqual({
        ...putFoobarRequest,
        url: barfooURL,
      });
    });
  });

  test('returns a modified request when the response status is 303 and has a location header set', () => {
    const response = normaliseResponse({
      status: 303,
      headers: {
        location: barfooURL,
      },
    });
    expect(getRedirectRequest(putFoobarRequest, response)).toEqual({
      ...putFoobarRequest,
      method: 'GET',
      url: barfooURL,
      headers: {
        ...putFoobarRequest.headers,
        'content-type': undefined,
      },
      body: undefined,
    });
  });
});
