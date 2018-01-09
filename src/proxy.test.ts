import * as http from 'http';
import * as https from 'https';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';
import proxy from './proxy';

// declare module 'http' {
//   export function __reset(): void;
// }

// declare module 'https' {
//   export function __reset(): void;
// }

// jest.mock('http', () => {
//   let callback: Function;
//   let request: jest.Mock<void> = jest.fn((opts, cb) => callback = cb);
//   return {
//     __reset() {
//       request.mockReset();
//       request.mockReturnValue({
//         on: jest.fn(),
//         end: jest.fn(() => {
//           callback();
//         })
//       });
//     },
//     request
//   };
// });

// jest.mock('https', () => {
//   let callback: Function;
//   let request: jest.Mock<void> = jest.fn();
//   return {
//     __reset() {
//       request.mockReset();
//       request.mockReturnValue({
//         on: jest.fn(),
//         end: jest.fn(() => {
//           callback();
//         })
//       });
//     },
//     request
//   };
// });

describe('proxy', () => {
  // beforeEach(() => {
  //   http.__reset();
  //   https.__reset();
  // });

  it('should call http.request() with the method, URL and headers', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    req
      .method('PUT')
      .url('http://httpbin.org/put')
      .header('foo', 'bar')
      .header('bar', 'foo');
    await proxy(req, res);

    const body = res.body() || '';
    expect(JSON.parse(body)).toEqual(
      expect.objectContaining({
        url: 'http://httpbin.org/put',
        headers: expect.objectContaining({
          Foo: 'bar',
          Bar: 'foo'
        })
      })
    );
  });

  it('should call https.request() with the method, URL and headers', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    req
      .method('PUT')
      .url('https://httpbin.org/put')
      .header('foo', 'bar')
      .header('bar', 'foo');
    await proxy(req, res);

    const body = res.body() || '';
    expect(JSON.parse(body)).toEqual(
      expect.objectContaining({
        url: 'https://httpbin.org/put',
        headers: expect.objectContaining({
          Foo: 'bar',
          Bar: 'foo'
        })
      })
    );
  });

  it('should call send() with a body', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    req
      .method('PUT')
      .url('http://httpbin.org/put')
      .header('Content-Length', '12')
      .body('Hello World!');
    await proxy(req, res);

    const body = res.body() || '';
    expect(JSON.parse(body)).toEqual(
      expect.objectContaining({
        url: 'http://httpbin.org/put',
        data: 'Hello World!'
      })
    );
  });

  it('should call send() without a body', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    req.method('PUT').url('http://httpbin.org/put');
    await proxy(req, res);

    const body = res.body() || '';
    expect(JSON.parse(body)).toEqual(
      expect.objectContaining({
        url: 'http://httpbin.org/put',
        data: ''
      })
    );
  });

  it('should set the reason', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    req.method('PUT').url('http://httpbin.org/put');
    await proxy(req, res);

    expect(res.reason()).toEqual('OK');
  });

  it('should set the headers', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    req.method('PUT').url('http://httpbin.org/put');
    await proxy(req, res);

    expect(res.headers()).toEqual(
      expect.objectContaining({
        'content-type': 'application/json',
        'content-length': '311'
      })
    );
  });

  it('should set the body', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    req.method('PUT').url('http://httpbin.org/put');
    await proxy(req, res);

    expect(res.body()).toBeDefined();
  });

  it('should error', async () => {
    expect.assertions(1);
    const req = new MockRequest();
    const res = new MockResponse();

    req.method('DELETE').url('invalid://blah');

    try {
      await proxy(req, res);
    } catch (error) {
      expect(error).not.toBeUndefined();
    }
  });
});
