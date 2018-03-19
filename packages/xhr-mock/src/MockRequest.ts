import {MockURL, parseURL} from './MockURL';
import {MockHeaders} from './MockHeaders';
import EventTarget from './MockEventTarget';
import MockProgressEvent from './MockProgressEvent';

const FORBIDDEN_METHODS = ['CONNECT', 'TRACE', 'TRACK'];
const UPPERCASE_METHODS = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

export default class MockRequest {
  private _method: string = 'GET';
  private _url: MockURL = parseURL('');
  private _headers: MockHeaders = {};
  private _body: null | string = null;

  method(): string;
  method(method: string): MockRequest;
  method(method?: string): string | MockRequest {
    if (typeof method !== 'undefined') {
      if (FORBIDDEN_METHODS.indexOf(method.toUpperCase()) !== -1) {
        throw new Error(`xhr-mock: Method "${method}" is forbidden.`);
      }

      if (UPPERCASE_METHODS.indexOf(method.toUpperCase()) !== -1) {
        this._method = method.toUpperCase();
      } else {
        this._method = method;
      }

      return this;
    } else {
      return this._method;
    }
  }

  url(): MockURL;
  url(url: string): MockRequest;
  url(url?: string): MockURL | MockRequest {
    if (typeof url === 'string') {
      this._url = parseURL(url);
      return this;
    } else {
      return this._url;
    }
  }

  header(name: string): null | string;
  header(name: string, value: string): MockRequest;
  header(name: string, value?: string): null | string | MockRequest {
    if (typeof value !== 'undefined') {
      this._headers[name.toLowerCase()] = value;
      return this;
    } else {
      return this._headers[name.toLowerCase()] || null;
    }
  }

  headers(): MockHeaders;
  headers(headers: MockHeaders): MockRequest;
  headers(headers?: MockHeaders): MockHeaders | MockRequest {
    if (typeof headers === 'object') {
      for (let name in headers) {
        if (headers.hasOwnProperty(name)) {
          this.header(name, headers[name]);
        }
      }
      return this;
    } else {
      return this._headers;
    }
  }

  body(): any;
  body(body: any): MockRequest;
  body(body?: any): any | MockRequest {
    if (typeof body !== 'undefined') {
      this._body = body;
      return this;
    } else {
      return this._body;
    }
  }
}
