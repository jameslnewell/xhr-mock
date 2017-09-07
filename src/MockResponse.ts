import {MockHeaders} from './MockHeaders';
import EventTarget from './MockEventTarget';
import MockProgressEvent from './MockProgressEvent';

export default class MockResponse {
  private _status: number = 200;
  private _reason: string = 'OK';
  private _headers: MockHeaders = {};
  private _body: null | string = null;
  private _eventTarget?: EventTarget;

  constructor(eventTarget?: EventTarget) {
    this._eventTarget = eventTarget;
  }

  status(): number;
  status(status: number): MockResponse;
  status(status?: number): number | MockResponse {
    if (typeof status !== 'undefined') {
      this._status = status;
      return this;
    } else {
      return this._status;
    }
  }

  reason(): string;
  reason(reason: string): MockResponse;
  reason(reason?: string): string | MockResponse {
    if (typeof reason !== 'undefined') {
      this._reason = reason;
      return this;
    } else {
      return this._reason;
    }
  }

  statusText(): null | string;
  statusText(reason: string): MockResponse;
  statusText(reason?: string): null | string | MockResponse {
    console.warn(
      'xhr-mock: MockResponse.statusText() has been deprecated. Use MockResponse.reason() instead.'
    );
    if (typeof reason !== 'undefined') {
      return this.reason(reason);
    } else {
      return this.reason();
    }
  }

  header(name: string): null | string;
  header(name: string, value: string): MockResponse;
  header(name: string, value?: string): null | string | MockResponse {
    if (typeof value !== 'undefined') {
      this._headers[name.toLowerCase()] = value;
      return this;
    } else {
      return this._headers[name.toLowerCase()] || null;
    }
  }

  headers(): MockHeaders;
  headers(headers: MockHeaders): MockResponse;
  headers(headers?: MockHeaders): MockHeaders | MockResponse {
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
  body(body: string): MockResponse;
  body(body?: string): null | string | MockResponse {
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
  ): MockResponse {
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
