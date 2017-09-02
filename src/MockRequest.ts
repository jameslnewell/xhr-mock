import URL = require('url-parse');
import EventTarget from './MockEventTarget';
import MockProgressEvent from './MockProgressEvent';

const FORBIDDEN_METHODS = ['CONNECT', 'TRACE', 'TRACK'];
const UPPERCASE_METHODS = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

export default class MockRequest {
  private _method: string = 'GET';
  private _url: null | string = null;
  private _headers: {[name: string]: string} = {};
  private _body: null | string = null;
  private _eventTarget?: EventTarget;

  constructor(eventTarget?: EventTarget) {
    this._eventTarget = eventTarget;
  }

  method(): null | string;
  method(method: string): MockRequest;
  method(method?: string): null | string | MockRequest {
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

  url(): null | URL;
  url(url: string): MockRequest;
  url(url?: string): null | URL | MockRequest {
    if (typeof url !== 'undefined') {
      this._url = url ? new URL(url, {protocol: ''}, true) : null;
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

  headers(): {};
  headers(headers: {}): MockRequest;
  headers(headers?: {}): {} | MockRequest {
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

  body(): null | string;
  body(body: string): MockRequest;
  body(body?: string): null | string | MockRequest {
    if (typeof body !== 'undefined') {
      this._body = body;
      return this;
    } else {
      return this._body;
    }
  }

  progress(
    lengthComputable: boolean = false,
    total: number = 0,
    loaded: number = 0
  ): MockRequest {
    if (this._eventTarget) {
      this._eventTarget.dispatchEvent(
        new MockProgressEvent('progress', {
          lengthComputable,
          loaded,
          total
        })
      );
    }
    return this;
  }
}
