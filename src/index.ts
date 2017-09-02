import window = require('global');
import {Mock, MockFunction} from './types';
import createMockFunction from './createMockFunction';
import MockXMLHttpRequest from './MockXMLHttpRequest';

const realXHRClass = window.XMLHttpRequest;
const mockXHRClass = MockXMLHttpRequest;

class XHRMock {
  setup(): XHRMock {
    window.XMLHttpRequest = mockXHRClass;
    this.reset();
    return this;
  }

  teardown(): XHRMock {
    this.reset();
    window.XMLHttpRequest = realXHRClass;
    return this;
  }

  reset(): XHRMock {
    MockXMLHttpRequest.removeAllHandlers();
    return this;
  }

  mock(fn: MockFunction): XHRMock;
  mock(method: string, url: string, mock: Mock): XHRMock;
  mock(method: string | MockFunction, url?: string, mock?: Mock): XHRMock {
    let fn;
    if (
      typeof method === 'string' &&
      typeof url === 'string' &&
      mock !== undefined
    ) {
      fn = createMockFunction(method, url, mock);
    } else {
      fn = method;
    }
    MockXMLHttpRequest.addHandler(fn);
    return this;
  }

  get(url: string, mock: Mock): XHRMock {
    return this.mock('GET', url, mock);
  }

  post(url: string, mock: Mock): XHRMock {
    return this.mock('POST', url, mock);
  }

  put(url: string, mock: Mock): XHRMock {
    return this.mock('PUT', url, mock);
  }

  patch(url: string, mock: Mock): XHRMock {
    return this.mock('PATCH', url, mock);
  }

  delete(url: string, mock: Mock): XHRMock {
    return this.mock('DELETE', url, mock);
  }
}

export default new XHRMock();
