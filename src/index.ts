import window = require('global');
import {Mock, MockFunction} from './types';
import createMockFunction from './createMockFunction';
import MockXMLHttpRequest from './MockXMLHttpRequest';

export const RealXMLHttpRequest = window.XMLHttpRequest;

export class XHRMock {
  setup(): XHRMock {
    window.XMLHttpRequest = MockXMLHttpRequest;
    this.reset();
    return this;
  }

  teardown(): XHRMock {
    this.reset();
    window.XMLHttpRequest = RealXMLHttpRequest;
    return this;
  }

  reset(): XHRMock {
    MockXMLHttpRequest.removeAllHandlers();
    return this;
  }

  mock(fn: MockFunction): XHRMock;
  mock(method: string, url: string, mock: Mock): XHRMock;
  mock(fnOrMethod: string | MockFunction, url?: string, mock?: Mock): XHRMock {
    let fn: MockFunction;
    if (
      typeof fnOrMethod === 'string' &&
      typeof url === 'string' &&
      mock !== undefined
    ) {
      fn = createMockFunction(fnOrMethod, url, mock);
    } else if (typeof fnOrMethod === 'function') {
      fn = fnOrMethod;
    } else {
      throw new Error('xhr-mock: Invalid parameters.');
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
