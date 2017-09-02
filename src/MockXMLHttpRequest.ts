import URL = require('url-parse');
import {MockFunction} from './types';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';
import MockEvent from './MockEvent';
import MockErrorEvent from './MockErrorEvent';
import MockProgressEvent from './MockProgressEvent';
import MockXMLHttpRequestUpload from './MockXMLHttpRequestUpload';
import MockXMLHttpRequestEventTarget from './MockXMLHttpRequestEventTarget';
import {sync as handleSync, async as handleAsync} from './handle';

const notImplementedError = new Error(
  "This feature hasn't been implmented yet. Please submit an Issue or Pull Request on Github."
);

//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
//http://www.w3.org/TR/2006/WD-XMLHttpRequest-20060405/
// https://xhr.spec.whatwg.org/

const FORBIDDEN_METHODS = ['CONNECT', 'TRACE', 'TRACK'];

enum ReadyState {
  UNSENT = 0,
  OPENED = 1,
  HEADERS_RECEIVED = 2,
  LOADING = 3,
  DONE = 4
}

function isMockResponsePromise(
  promise: MockResponse | Promise<MockResponse>
): promise is Promise<MockResponse> {
  return (promise as Promise<MockResponse>).then !== undefined;
}

export default class MockXMLHttpRequest extends MockXMLHttpRequestEventTarget {
  static readonly UNSENT = ReadyState.UNSENT;
  static readonly OPENED = ReadyState.OPENED;
  static readonly HEADERS_RECEIVED = ReadyState.HEADERS_RECEIVED;
  static readonly LOADING = ReadyState.LOADING;
  static readonly DONE = ReadyState.DONE;

  response: any;
  responseText: string;
  responseType: XMLHttpRequestResponseType;
  responseURL: string;
  responseXML: Document | null;
  status: number;
  statusText: string;
  timeout: number = 0;
  upload: XMLHttpRequestUpload;
  onreadystatechange: (this: XMLHttpRequest, ev: Event) => any;

  //some libraries (like Mixpanel) use the presence of this field to check if XHR is properly supported
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
  withCredentials: boolean = false;

  /** @private */
  static handlers: MockFunction[] = [];

  /**
   * Add a mock handler
   */
  static addHandler(fn: MockFunction): void {
    this.handlers.push(fn);
  }

  /**
   * Remove a mock handler
   */
  static removeHandler(fn: MockFunction): void {
    throw notImplementedError;
  }

  /**
   * Remove all request handlers
   */
  static removeAllHandlers(): void {
    this.handlers = [];
  }

  private _request: MockRequest;
  private _response: MockResponse;
  private _readyState: ReadyState;
  private _async: boolean;
  private _sending: boolean;
  private _aborting: boolean;
  private _timeoutTimer: number;

  constructor() {
    super();
    this._reset();
  }

  /** @private */
  _reset() {
    this.upload = new MockXMLHttpRequestUpload();
    this.status = 0;
    this.statusText = '';
    this.response = null;
    this.responseType = '';
    this.responseText = '';
    this.responseXML = null;

    this._request = new MockRequest(this.upload);
    this._response = new MockResponse(this);
    this._readyState = MockXMLHttpRequest.UNSENT;

    this._sending = false;
    this._aborting = false;
  }

  get readyState(): ReadyState {
    return this._readyState;
  }

  set readyState(value: ReadyState) {
    this._readyState = value;
    this.dispatchEvent(new MockEvent('readystatechange'));
  }

  getAllResponseHeaders(): string {
    if (this.readyState < MockXMLHttpRequest.HEADERS_RECEIVED) {
      return '';
    }

    const headers = this._response.headers();
    const result = Object.keys(headers)
      .map(name => `${name}: ${headers[name]}\r\n`)
      .join('');

    return result;
  }

  getResponseHeader(name: string): null | string {
    if (this.readyState < MockXMLHttpRequest.HEADERS_RECEIVED) {
      return null;
    }

    return this._response.header(name);
  }

  setRequestHeader(name: string, value: string): void {
    if (this.readyState < MockXMLHttpRequest.OPENED) {
      throw new Error('xhr-mock: request must be OPENED.');
    }

    this._request.header(name, value);
  }

  overrideMimeType(mime: string): void {
    throw notImplementedError;
  }

  open(
    method: string,
    url: string,
    async: boolean = true,
    username?: string,
    password?: string
  ): void {
    //check method type
    if (FORBIDDEN_METHODS.indexOf(method) !== -1) {
      throw new Error(`xhr-mock: Method ${method} is forbidden.`);
    }

    //normalize method
    method = method.toUpperCase();

    //create the full url including the username and password
    const fullURL = new URL(url, {protocol: ''});
    fullURL.set('username', username);
    fullURL.set('password', password);

    this._reset();
    this._async = async;
    this._request
      .method(method)
      .url(fullURL)
      .header('accept', '*/*');

    this.readyState = MockXMLHttpRequest.OPENED;
  }

  _handleSendResponse(res: MockResponse) {
    //we've got a response before the timeout period so we don't want to timeout
    clearTimeout(this._timeoutTimer);

    //TODO: check if we've been aborted
    if (this._aborting) {
      return;
    }

    //indicate the request body has been fully sent
    const reqBody = this._request.body();
    if (reqBody) {
      const requestTotal = reqBody ? reqBody.length : 0;
      this.upload.dispatchEvent(
        new MockProgressEvent('progress', {
          lengthComputable: true,
          loaded: requestTotal,
          total: requestTotal
        })
      );
      this.upload.dispatchEvent(new MockProgressEvent('load'));
      this.upload.dispatchEvent(new MockProgressEvent('loadend'));
    }

    //set the response headers on the XHR object
    const resBody = res.body();
    this._response = res;
    this.status = res.status() || 200;
    this.statusText = res.reason() || 'OK';
    this.responseType = 'text';
    this.readyState = MockXMLHttpRequest.HEADERS_RECEIVED;

    //set the response body on the XHR object (note: it should only be partial data here)
    this.response = resBody; //TODO: detect an object and return JSON, detect XML and return XML
    this.responseText = String(resBody);
    this.readyState = MockXMLHttpRequest.LOADING;

    //indicate response progress
    //FIXME: response.progress() shouldn't be called before here
    let responseTotal = 0;
    let responseLengthComputable = false;
    const contentLength = res.header('content-length');
    if (typeof contentLength === 'string') {
      responseTotal = parseInt(contentLength, 10);
      responseLengthComputable = responseTotal > 0;
    }
    this.dispatchEvent(
      new MockProgressEvent('progress', {
        lengthComputable: responseLengthComputable,
        loaded: 0,
        total: responseTotal
      })
    );
    //FIXME: allow user to specify custom progress here
    this.dispatchEvent(
      new MockProgressEvent('progress', {
        lengthComputable: responseLengthComputable,
        loaded: resBody ? resBody.length : 0,
        total: responseTotal
      })
    );

    //indicate the response has been fully received
    this.readyState = MockXMLHttpRequest.DONE;
    this.dispatchEvent(new MockEvent('load'));
    this.dispatchEvent(new MockEvent('loadend'));
  }

  _handleSendError(error: Error) {
    //we've got a response before the timeout period so we don't want to timeout
    clearTimeout(this._timeoutTimer);

    this.readyState = MockXMLHttpRequest.DONE;
    this.dispatchEvent(new MockErrorEvent('error', {error}));
  }

  // send(data?: Document): void;
  // send(data?: string): void;
  // send(data?: any): void;
  send(body?: string): void {
    //readyState must be opened
    if (this.readyState !== MockXMLHttpRequest.OPENED) {
      throw new Error('xhr-mock: Please call .open() before .send().');
    }

    this._sending = true;

    //body is ignored for GET and HEAD requests
    if (this._request.method() === 'get' || this._request.method() === 'head') {
      body = undefined;
    }

    //TODO: extract body and content-type https://fetch.spec.whatwg.org/#concept-bodyinit-extract
    if (body) {
      this._request.body(body);
    }

    //dispatch a timeout event if we haven't received a response in the specified amount of time
    // - we actually wait for the timeout amount of time because many packages like jQuery and Superagent
    // use setTimeout() to artificially detect a timeout rather than using the native timeout event
    //TODO: handle timeout being changed mid-request
    if (this.timeout) {
      this._timeoutTimer = setTimeout(() => {
        this.readyState = MockXMLHttpRequest.DONE;
        this.dispatchEvent(new MockEvent('timeout'));
      }, this.timeout);
    }

    //indicate the request has started being sent
    this.dispatchEvent(new MockEvent('loadstart'));
    if (body) {
      this.upload.dispatchEvent(new MockEvent('loadstart'));
    }

    //indicate request progress
    if (body) {
      const requestTotal = body ? body.length : 0;
      this.upload.dispatchEvent(
        new MockProgressEvent('progress', {
          lengthComputable: true,
          loaded: 0,
          total: requestTotal
        })
      );
    }

    if (this._async) {
      handleAsync(
        MockXMLHttpRequest.handlers,
        this._request,
        this._response
      ).then(
        response => this._handleSendResponse(response),
        error => this._handleSendError(error)
      );
    } else {
      try {
        const response = handleSync(
          MockXMLHttpRequest.handlers,
          this._request,
          this._response
        );

        if (isMockResponsePromise(response)) {
          throw new Error(
            'xhr-mock: A handler returned a Promise<MockResponse> when in sync mode.'
          );
        } else {
          this._handleSendResponse(response);
        }
      } catch (error) {
        this._handleSendError(error);
      }
    }
  }

  abort(): void {
    //FIXME: according to spec

    //we've cancelling the response before the timeout period so we don't want to timeout
    clearTimeout(this._timeoutTimer);

    if (this._sending) {
      this.readyState = MockXMLHttpRequest.DONE;
      if (this._request.body()) {
        this.upload.dispatchEvent(new MockEvent('progress'));
      }
      this.dispatchEvent(new MockEvent('progress'));
      this.dispatchEvent(new MockEvent('abort'));
      this.dispatchEvent(new MockEvent('loadend'));
    }

    //TODO: check spec
    if (this.readyState === MockXMLHttpRequest.DONE) {
      this._readyState = MockXMLHttpRequest.UNSENT;
      this.status = 0;
      this.statusText = '';
      this.responseType = '';
    }

    this._sending = false;
    this._aborting = true;
  }
}
