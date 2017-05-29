import createHandler from './createHandler';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';

describe('createHandler()', () => {
  it('should not match a request with a different method and a different URL', () => {
    const req = new MockRequest();
    const res = new MockResponse();
    const fn = createHandler(
      'put',
      'https://www.example.com/about.html',
      () => true
    );

    req.method('GET').url('https://www.example.com/index.html');

    expect(fn(req, res)).toBeFalsy();
  });

  it('should not match a request with the same method and a different URL', () => {
    const req = new MockRequest();
    const res = new MockResponse();
    const fn = createHandler(
      'put',
      'https://www.example.com/about.html',
      () => true
    );

    req.method('PUT').url('https://www.example.com/index.html');

    expect(fn(req, res)).toBeFalsy();
  });

  it('should not match a request with a different method and the same URL', () => {
    const req = new MockRequest();
    const res = new MockResponse();
    const fn = createHandler(
      'put',
      'https://www.example.com/about.html',
      () => true
    );

    req.method('GET').url('https://www.example.com/about.html');

    expect(fn(req, res)).toBeFalsy();
  });

  it('should match a request with the same method and the same URL', () => {
    const req = new MockRequest();
    const res = new MockResponse();
    const fn = createHandler(
      'PUT',
      'https://www.example.com/about.html',
      () => true
    );

    req.method('PUT').url('https://www.example.com/about.html');

    expect(fn(req, res)).toBeTruthy();
  });

  it('should match a request with the same method and a similar URL', () => {
    const req = new MockRequest();
    const res = new MockResponse();
    const fn = createHandler('PUT', /about\.html$/, () => true);

    req.method('PUT').url('https://www.example.com/about.html');

    expect(fn(req, res)).toBeTruthy();
  });
});
