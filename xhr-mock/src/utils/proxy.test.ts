import * as http from 'http';
import * as https from 'https';
import {MockRequest, MockResponse, MockContextWithSync} from '../router';
import {proxy} from '.';

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

  it('should throw when the request is synchronous', async () => {
    expect(() =>
      proxy(
        {
          version: '1.1',
          method: 'put',
          uri: 'https://httpbin.org/put',
          headers: {},
          body: null,
        },
        {sync: true},
      ),
    ).toThrow();
  });

  it('should call create a HTTP request with the method, headers and body', async () => {
    const res = await proxy(
      {
        version: '1.1',
        method: 'put',
        uri: 'http://httpbin.org/put',
        headers: {
          foo: 'bar',
          bar: 'foo',
        },
        body: null,
      },
      {sync: false},
    );

    const body = res.body || '';
    expect(JSON.parse(body)).toEqual(
      expect.objectContaining({
        url: 'http://httpbin.org/put',
        headers: expect.objectContaining({
          Foo: 'bar',
          Bar: 'foo',
        }),
      }),
    );
  });

  it('should create a HTTPS request with the method, headers and body', async () => {
    const res = await proxy(
      {
        version: '1.1',
        method: 'put',
        uri: 'https://httpbin.org/put',
        headers: {
          'Content-Length': '12',
        },
        body: 'Hello World!',
      },
      {sync: false},
    );

    const body = res.body || '';
    expect(JSON.parse(body)).toEqual(
      expect.objectContaining({
        url: 'https://httpbin.org/put',
        headers: expect.objectContaining({
          'Content-Length': '12',
        }),
        data: 'Hello World!',
      }),
    );
  });

  it('should create a request with a body', async () => {
    const res = await proxy(
      {
        version: '1.1',
        method: 'put',
        uri: 'https://httpbin.org/put',
        headers: {
          'content-length': '12',
        },
        body: 'Hello World!',
      },
      {sync: false},
    );

    const body = res.body || '';
    expect(JSON.parse(body)).toEqual(
      expect.objectContaining({
        url: 'https://httpbin.org/put',
        data: 'Hello World!',
      }),
    );
  });

  it('should create a request without a body', async () => {
    const res = await proxy(
      {
        version: '1.1',
        method: 'put',
        uri: 'https://httpbin.org/put',
        headers: {},
        body: null,
      },
      {sync: false},
    );

    const body = res.body || '';
    expect(JSON.parse(body)).toEqual(
      expect.objectContaining({
        url: 'https://httpbin.org/put',
        data: '',
      }),
    );
  });

  it('should set the reason', async () => {
    const res = await proxy(
      {
        version: '1.1',
        method: 'put',
        uri: 'https://httpbin.org/put',
        headers: {},
        body: null,
      },
      {sync: false},
    );

    expect(res.reason).toEqual('OK');
  });

  it('should set the headers', async () => {
    const res = await proxy(
      {
        version: '1.1',
        method: 'put',
        uri: 'https://httpbin.org/put',
        headers: {},
        body: null,
      },
      {sync: false},
    );

    expect(res.headers).toEqual(
      expect.objectContaining({
        'content-type': 'application/json',
        'content-length': expect.any(String),
      }),
    );
  });

  it('should set the body', async () => {
    const res = await proxy(
      {
        version: '1.1',
        method: 'put',
        uri: 'https://httpbin.org/put',
        headers: {},
        body: null,
      },
      {sync: false},
    );

    expect(res.body).toBeDefined();
  });

  it('should error', async () => {
    expect.assertions(1);
    try {
      const res = await proxy(
        {
          version: '1.1',
          method: 'delete',
          uri: 'invalid://blah',
          headers: {},
          body: null,
        },
        {sync: false},
      );
    } catch (error) {
      expect(error).not.toBeUndefined();
    }
  });
});
