import {MockURL, parseURL, formatURL} from './MockURL';
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

export enum ReadyState {
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
  upload: XMLHttpRequestUpload = new MockXMLHttpRequestUpload();
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

  private mockRequest: MockRequest;
  private mockResponse: MockResponse;
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
  private _reset() {
    this.status = 0;
    this.statusText = '';
    this.response = null;
    this.responseType = '';
    this.responseText = '';
    this.responseXML = null;

    this.mockRequest = new MockRequest();
    this.mockResponse = new MockResponse();
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

    const headers = this.mockResponse.headers();
    const result = Object.keys(headers)
      .map(name => `${name}: ${headers[name]}\r\n`)
      .join('');

    return result;
  }

  getResponseHeader(name: string): null | string {
    if (this.readyState < MockXMLHttpRequest.HEADERS_RECEIVED) {
      return null;
    }

    return this.mockResponse.header(name);
  }

  setRequestHeader(name: string, value: string): void {
    if (this.readyState < MockXMLHttpRequest.OPENED) {
      throw new Error('xhr-mock: request must be OPENED.');
    }

    this.mockRequest.header(name, value);
  }

  overrideMimeType(mime: string): void {
    this.mockResponse.header('Content-Type', mime);
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
    const fullURL = parseURL(url);
    fullURL.username = username || '';
    fullURL.password = password || '';

    this._reset();
    this._async = async;
    this.mockRequest
      .method(method)
      .url(formatURL(fullURL))
      .header('accept', '*/*');

    this.readyState = MockXMLHttpRequest.OPENED;
  }

  private dispatchUploadProgressEvent(type: string) {
    const body = this.mockRequest.body();
    const total = body ? body.length : 0;
    this.upload.dispatchEvent(
      new ProgressEvent(type, {
        lengthComputable: true,
        loaded: total,
        total: total
      })
    );
  }

  private dispatchDownloadProgressEvent(type: string) {}

  private handleSendResponse(res: MockResponse) {
    //we've got a response before the timeout period so we don't want to timeout
    clearTimeout(this._timeoutTimer);

    //TODO: check if we've timedout
    if (this._aborting) {
      return;
    }

    //set the response headers on the XHR object
    this.readyState = MockXMLHttpRequest.HEADERS_RECEIVED;
    this.mockResponse = res;
    this.status = res.status();
    this.statusText = res.reason();

    let total = 0;
    const contentLength = res.header('Content-Length');
    if (contentLength) {
      total = parseInt(contentLength, 10);
    }

    //set the response body on the XHR object (note: it should only be partial data here)
    const body = res.body();
    if (body !== undefined) {
      this.readyState = MockXMLHttpRequest.LOADING;

      //send initial progress event
      this.dispatchEvent(
        new MockProgressEvent('progress', {
          lengthComputable: total > 0,
          loaded: 0, //TODO: use a % of the body
          total: total
        })
      );

      //TODO: check if we've aborted or timedout
      //TODO: trigger progress event every 50ms with a % of body length loaded

      this.responseType = 'text';
      this.response = body; //TODO: detect an object and return JSON, detect XML and return XML
      this.responseText = String(body);
    }

    //send final progress event
    this.dispatchEvent(
      new MockProgressEvent('progress', {
        lengthComputable: total > 0,
        loaded: body ? body.length : 0, // TODO: should be in bytes
        total: total
      })
    );

    //indicate the response has been fully received
    this.readyState = MockXMLHttpRequest.DONE;

    this._sending = false;

    this.dispatchEvent(
      new MockProgressEvent('load', {
        lengthComputable: total > 0,
        loaded: body ? body.length : 0, // TODO: should be in bytes
        total: total
      })
    );

    this.dispatchEvent(
      new MockProgressEvent('loadend', {
        lengthComputable: total > 0,
        loaded: body ? body.length : 0, // TODO: should be in bytes
        total: total
      })
    );
  }

  private handleSendError(error: Error) {
    //TODO: https://xhr.spec.whatwg.org/#request-error-steps
    debugger;

    if (!this._sending) {
      return;
    }
    this._sending = false;

    //we've got a response before the timeout period so we don't want to timeout
    clearTimeout(this._timeoutTimer);

    this.status = 0;
    this.statusText = '';
    this.responseType = '';
    this.responseText = '';

    this.readyState = MockXMLHttpRequest.DONE;
    this.dispatchEvent(new MockErrorEvent('error', {error}));

    //TODO: throw error if sync mode
  }

  private handleSendTimeout() {
    this.readyState = MockXMLHttpRequest.DONE;
    this.dispatchEvent(new MockEvent('timeout'));
  }

  // https://xhr.spec.whatwg.org/#event-xhr-loadstart
  // send(data?: Document): void;
  // send(data?: string): void;
  // send(data?: any): void;
  send(body?: string): void {
    //readyState must be opened
    if (this.readyState !== MockXMLHttpRequest.OPENED) {
      throw new Error('xhr-mock: Please call .open() before .send().');
    }

    if (this._sending) {
      throw new Error('xhr-mock: .send() has already been called.');
    }

    this._sending = true;

    //body is ignored for GET and HEAD requests
    if (
      this.mockRequest.method() === 'GET' ||
      this.mockRequest.method() === 'HEAD'
    ) {
      body = undefined;
    }

    if (body !== undefined) {
      //TODO: extract body and content-type https://fetch.spec.whatwg.org/#concept-bodyinit-extract
      this.mockRequest.body(body);
    }

    //TODO: check CORs

    //dispatch a timeout event if we haven't received a response in the specified amount of time
    // - we actually wait for the timeout amount of time because many packages like jQuery and Superagent
    // use setTimeout() to artificially detect a timeout rather than using the native timeout event
    //TODO: handle timeout being changed mid-request
    if (this.timeout) {
      this._timeoutTimer = setTimeout(
        () => this.handleSendTimeout(),
        this.timeout
      );
    }

    //indicate the request has started being sent
    this.dispatchEvent(new MockEvent('loadstart'));

    //indicate request progress
    if (body !== undefined) {
      this.upload.dispatchEvent(new MockProgressEvent('loadstart'));

      const total = body ? body.length : 0; //TODO: use Content-Length instead

      //send initial progress event
      this.upload.dispatchEvent(
        new MockProgressEvent('progress', {
          lengthComputable: total > 0,
          loaded: 0,
          total: total
        })
      );

      //TODO: check if we've aborted or timedout
      //TODO: trigger progress event every 50ms with a % of body length loaded

      //send final progress event
      this.upload.dispatchEvent(
        new MockProgressEvent('progress', {
          lengthComputable: total > 0,
          loaded: body.length, // TODO: should be in bytes
          total: total
        })
      );

      this.upload.dispatchEvent(
        new MockProgressEvent('load', {
          lengthComputable: total > 0,
          loaded: body.length, // TODO: should be in bytes
          total: total
        })
      );

      this.upload.dispatchEvent(
        new MockProgressEvent('loadend', {
          lengthComputable: total > 0,
          loaded: body.length, // TODO: should be in bytes
          total: total
        })
      );
    }

    if (this._async) {
      debugger;
      handleAsync(
        MockXMLHttpRequest.handlers,
        this.mockRequest,
        this.mockResponse
      ).then(
        response => this.handleSendResponse(response),
        error => this.handleSendError(error)
      );
    } else {
      try {
        const response = handleSync(
          MockXMLHttpRequest.handlers,
          this.mockRequest,
          this.mockResponse
        );

        if (isMockResponsePromise(response)) {
          throw new Error(
            'xhr-mock: A handler returned a Promise<MockResponse> when in sync mode.'
          );
        } else {
          this.handleSendResponse(response);
        }
      } catch (error) {
        this.handleSendError(error);
      }
    }
  }

  abort(): void {
    //FIXME: according to spec

    //we've cancelling the response before the timeout period so we don't want to timeout
    clearTimeout(this._timeoutTimer);

    if (this._sending) {
      this.readyState = MockXMLHttpRequest.DONE;
      if (this.mockRequest.body()) {
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
