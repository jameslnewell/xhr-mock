import {__replaceRealXHR} from './XHRMock';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';
import proxy from './proxy.browser';

type RealXHRMock = {
  error?: Error;
  status: number;
  statusText: string;
  response: any;
  setRequestHeader: jest.Mock<void>;
  getAllResponseHeaders: jest.Mock<string>;
  open: jest.Mock<void>;
  send: jest.Mock<void>;
  onerror?: jest.Mock<void>;
  onloadend?: jest.Mock<void>;
};

declare module './XHRMock' {
  export function __replaceRealXHR(): RealXHRMock;
}

jest.mock('./XHRMock', () => {
  let mock: RealXHRMock;
  return {
    __replaceRealXHR() {
      mock = {
        status: 200,
        statusText: '',
        response: null,
        setRequestHeader: jest.fn(),
        getAllResponseHeaders: jest.fn<string>().mockReturnValue(''),
        open: jest.fn(),
        send: jest.fn(() => {
          if (mock.error && mock.onerror) {
            mock.onerror({error: mock.error});
          } else if (mock.onloadend) {
            mock.onloadend();
          }
        })
      };
      return mock;
    },
    default: {
      RealXMLHttpRequest: jest.fn(() => mock)
    }
  };
});

describe('proxy.browser', () => {
  let xhr: RealXHRMock;

  beforeEach(() => {
    xhr = __replaceRealXHR();
  });

  it('should call open() with the method and URL', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    req.method('PUT').url('http://httpbin.org/put');
    await proxy(req, res);

    expect(xhr.open).toBeCalledWith('PUT', 'http://httpbin.org/put');
  });

  it('should set the request headers', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    req.header('foo', 'bar').header('bar', 'foo');
    await proxy(req, res);

    expect(xhr.setRequestHeader).toBeCalledWith('foo', 'bar');
  });

  it('should call send() with a body', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    req.body('Hello World!');
    await proxy(req, res);

    expect(xhr.send).toBeCalledWith('Hello World!');
  });

  it('should call send() without a body', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    await proxy(req, res);

    expect(xhr.send).toBeCalledWith(null);
  });

  it('should set the status', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    xhr.status = 201;
    await proxy(req, res);

    expect(res.status()).toEqual(201);
  });

  it('should set the reason', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    xhr.statusText = 'Created';
    await proxy(req, res);

    expect(res.reason()).toEqual('Created');
  });

  it('should set the headers', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    xhr.getAllResponseHeaders.mockReturnValue('foo: bar\r\nbar: foo\r\n');
    await proxy(req, res);

    expect(res.headers()).toEqual(
      expect.objectContaining({
        foo: 'bar',
        bar: 'foo'
      })
    );
  });

  it('should set the body when .response is text', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    xhr.response = 'Hello World!';
    await proxy(req, res);

    expect(res.body()).toEqual('Hello World!');
  });

  it('should set the body when response is null', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    xhr.response = null;
    await proxy(req, res);

    expect(res.body()).toEqual(null);
  });

  it('should set the body when response is an array', async () => {
    const req = new MockRequest();
    const res = new MockResponse();

    xhr.response = [];
    await proxy(req, res);

    expect(res.body()).toEqual([]);
  });

  it('should error', async () => {
    expect.assertions(1);
    const req = new MockRequest();
    const res = new MockResponse();

    xhr.error = new Error();
    try {
      await proxy(req, res);
    } catch (error) {
      expect(error).not.toBeUndefined();
    }
  });
});
