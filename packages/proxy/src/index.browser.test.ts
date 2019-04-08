import {Request, Response, Context, Mode} from '@xhr-mock/router';
import {proxy} from './index.browser';

const defaultRequest: Request = {
  version: '1.1',
  method: 'get',
  url: '/',
  params: {},
  headers: {
    foo: 'bar',
    bar: 'foo'
  },
  body: 'Hello World'
};

const defaultResponse: Response = {
  version: '1.1',
  status: 206,
  reason: 'Partial Response',
  headers: {
    foo: 'bar',
    bar: 'foo'
  },
  body: {
    message: 'Hello World!'
  }
};

function createContext(error: boolean = false): Context {
  const xhr = new XMLHttpRequest();

  jest.spyOn(xhr, 'status').mockImplementation(206);
  jest.spyOn(xhr, 'send').mockImplementation(() => {
    if (error) {
      if (xhr.onerror) {
        xhr.onerror(new ProgressEvent('error'));
      }
    } else {
      if (xhr.onloadend) {
        xhr.onloadend(new ProgressEvent('loadend'));
      }
    }
  });

  return {
    mode: Mode.ASYNC
  };
}

describe('proxy.browser', () => {
  it('should return a response with values from the XMLHttpRequest ', async () => {
    const response = await proxy()(defaultRequest, createContext());
    expect(response).toEqual(defaultResponse);
  });
});
