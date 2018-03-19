import {MockURL, parseURL, formatURL} from './MockURL';
import {MockFunction, MockHeaders, ErrorCallbackEvent} from './types';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';
import MockEvent from './MockEvent';
import MockProgressEvent from './MockProgressEvent';
import MockXMLHttpRequestUpload from './MockXMLHttpRequestUpload';
import MockXMLHttpRequestEventTarget from './MockXMLHttpRequestEventTarget';
import {sync as handleSync, async as handleAsync} from './handle';

const notImplementedError = new Error(
  "xhr-mock: This feature hasn't been implmented yet. Please submit an Issue or Pull Request on Github."
);

// implemented according to https://xhr.spec.whatwg.org/

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

function calculateProgress(req: MockRequest | MockResponse) {
  const header = req.header('content-length');
  const body = req.body();

  let lengthComputable = false;
  let total = 0;

  if (header) {
    const contentLength = parseInt(header, 10);
    if (contentLength !== NaN) {
      lengthComputable = true;
      total = contentLength;
    }
  }

  return {
    lengthComputable,
    loaded: (body && body.length) || 0, //FIXME: Measure bytes not (unicode) chars
    total
  };
}

// @ts-ignore: https://github.com/jameslnewell/xhr-mock/issues/45
export default class MockXMLHttpRequest extends MockXMLHttpRequestEventTarget
  implements XMLHttpRequest {
  static readonly UNSENT = ReadyState.UNSENT;
  static readonly OPENED = ReadyState.OPENED;
  static readonly HEADERS_RECEIVED = ReadyState.HEADERS_RECEIVED;
  static readonly LOADING = ReadyState.LOADING;
  static readonly DONE = ReadyState.DONE;

  readonly UNSENT = ReadyState.UNSENT;
  readonly OPENED = ReadyState.OPENED;
  readonly HEADERS_RECEIVED = ReadyState.HEADERS_RECEIVED;
  readonly LOADING = ReadyState.LOADING;
  readonly DONE = ReadyState.DONE;

  onreadystatechange: (this: XMLHttpRequest, ev: Event) => any;

  //some libraries (like Mixpanel) use the presence of this field to check if XHR is properly supported
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
  withCredentials: boolean = false;

  static handlers: MockFunction[] = [];
  static errorCallback: (event: ErrorCallbackEvent) => void = ({err}) =>
    console.error(
      `xhr-mock: A handler errored: \n ${(err && err.stack) || err}`
    );

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

  private req: MockRequest = new MockRequest();
  private res: MockResponse = new MockResponse();

  responseType: XMLHttpRequestResponseType = '';
  responseURL: string = '';
  private _timeout: number = 0;
  // @ts-ignore: https://github.com/jameslnewell/xhr-mock/issues/45
  upload: XMLHttpRequestUpload = new MockXMLHttpRequestUpload();
  readyState: ReadyState = MockXMLHttpRequest.UNSENT;

  // flags
  private isSynchronous: boolean = false;
  private isSending: boolean = false;
  private isUploadComplete: boolean = false;
  private isAborted: boolean = false;
  private isTimedOut: boolean = false;

  // @ts-ignore: wants a NodeJS.Timer because of @types/node
  private _timeoutTimer: number;

  get timeout(): number {
    return this._timeout;
  }

  set timeout(timeout: number) {
    if (timeout !== 0 && this.isSynchronous) {
      throw new Error(
        'Timeouts cannot be set for synchronous requests made from a document.'
      );
    }
    this._timeout = timeout;
  }

  // https://xhr.spec.whatwg.org/#the-response-attribute
  get response(): any {
    if (this.responseType === '' || this.responseType === 'text') {
      if (this.readyState !== this.LOADING && this.readyState !== this.DONE) {
        return '';
      }
      return this.responseText;
    }

    if (this.readyState !== this.DONE) {
      return null;
    }

    const body = this.res.body();
    if (!body) {
      return null;
    }

    if (this.responseType === 'json' && typeof body === 'string') {
      try {
        return JSON.parse(this.responseText);
      } catch (error) {
        return null;
      }
    }

    if (this.responseType === 'blob' && typeof body === 'string') {
      try {
        throw notImplementedError;
      } catch (error) {
        return null;
      }
    }

    if (this.responseType === 'arraybuffer' && typeof body === 'string') {
      try {
        throw notImplementedError;
      } catch (error) {
        return null;
      }
    }

    if (this.responseType === 'document' && typeof body === 'string') {
      try {
        throw notImplementedError;
      } catch (error) {
        return null;
      }
    }

    // rely on the mock to do the right thing with an arraybuffer, blob or document
    return body;
  }

  get responseText(): string {
    return this.res.body() || '';
  }

  get responseXML(): Document | null {
    return null; // FIXME:
  }

  get status(): number {
    return this.res.status();
  }

  get statusText(): string {
    return this.res.reason();
  }

  getAllResponseHeaders(): string {
    // I'm pretty sure this fn can return null, but TS types say no
    // if (this.readyState < MockXMLHttpRequest.HEADERS_RECEIVED) {
    //   return null;
    // }
    const headers = this.res.headers();
    const result = Object.keys(headers)
      .map(name => `${name}: ${headers[name]}\r\n`)
      .join('');

    return result;
  }

  getResponseHeader(name: string): null | string {
    if (this.readyState < MockXMLHttpRequest.HEADERS_RECEIVED) {
      return null;
    }

    return this.res.header(name);
  }

  setRequestHeader(name: string, value: string): void {
    if (this.readyState < MockXMLHttpRequest.OPENED) {
      throw new Error('xhr-mock: xhr must be OPENED.');
    }

    this.req.header(name, value);
  }

  overrideMimeType(mime: string): void {
    throw notImplementedError;
  }

  open(
    method: string,
    url: string,
    async: boolean = true,
    username: string | null = null,
    password: string | null = null
  ): void {
    // if method is not a method, then throw a "SyntaxError" DOMException
    // if method is a forbidden method, then throw a "SecurityError" DOMException
    if (FORBIDDEN_METHODS.indexOf(method) !== -1) {
      throw new Error(`xhr-mock: Method ${method} is forbidden.`);
    }

    // normalize method
    method = method.toUpperCase();

    // let parsedURL be the result of parsing url with settingsObject’s API base URL and settingsObject’s API URL character encoding
    // if parsedURL is failure, then throw a "SyntaxError" DOMException
    const fullURL = parseURL(url);

    // if the async argument is omitted, set async to true, and set username and password to null.

    // if parsedURL’s host is non-null, run these substeps:
    // if the username argument is not null, set the username given parsedURL and username
    // if the password argument is not null, set the password given parsedURL and password
    fullURL.username = username || '';
    fullURL.password = (username && password) || '';

    // if async is false, current global object is a Window object, and the timeout attribute value
    // is not zero or the responseType attribute value is not the empty string, then throw an "InvalidAccessError" DOMException.
    if (!async && (this._timeout !== 0 || this.responseType !== '')) {
      throw new Error('InvalidAccessError');
    }

    // terminate the ongoing fetch operated by the XMLHttpRequest object
    if (this.isSending) {
      throw new Error('xhr-mock: Unable to terminate the previous request');
    }

    // set variables associated with the object as follows:
    // - unset the send() flag and upload listener flag
    // - set the synchronous flag, if async is false, and unset the synchronous flag otherwise
    // - set request method to method
    // - set request URL to parsedURL
    // - empty author request headers
    this.isSending = false;
    this.isSynchronous = !async;
    this.req
      .method(method)
      .headers({})
      .url(formatURL(fullURL));
    this.applyNetworkError();

    // if the state is not opened, run these substeps:
    if (this.readyState !== this.OPENED) {
      // set state to opened
      this.readyState = MockXMLHttpRequest.OPENED;

      // fire an event named readystatechange
      this.dispatchEvent(new MockEvent('readystatechange'));
    }
  }

  private sendSync() {
    // let response be the result of fetching req
    let res;
    try {
      res = handleSync(MockXMLHttpRequest.handlers, this.req, this.res);

      if (isMockResponsePromise(res)) {
        throw new Error(
          'xhr-mock: A handler returned a Promise<MockResponse> in sync mode.'
        );
      }

      // if the timeout attribute value is not zero, then set the timed out flag and terminate fetching if it has not returned within the amount of milliseconds from the timeout.
      // TODO: check if timeout was elapsed

      //if response’s body is null, then run handle response end-of-body and return
      // let reader be the result of getting a reader from response’s body’s stream
      // let promise be the result of reading all bytes from response’s body’s stream with reader
      // wait for promise to be fulfilled or rejected
      // if promise is fulfilled with bytes, then append bytes to received bytes
      // run handle response end-of-body for response
      this.handleResponseBody(res);
    } catch (error) {
      MockXMLHttpRequest.errorCallback({req: this.req, err: error});
      this.handleError(error);
    }
  }

  private async sendAsync() {
    const req = this.req;

    // fire a progress event named loadstart with 0 and 0
    const progress = calculateProgress(this.res);
    this.dispatchEvent(
      new MockProgressEvent('loadstart', {
        ...progress,
        loaded: 0
      })
    );

    // if the upload complete flag is unset and upload listener flag is set, then fire a progress
    // event named loadstart on the XMLHttpRequestUpload object with 0 and req’s body’s total bytes.
    if (!this.isUploadComplete) {
      const progress = calculateProgress(this.req);
      this.upload.dispatchEvent(
        new MockProgressEvent('loadstart', {
          ...progress,
          loaded: 0
        })
      );
    }

    // if state is not opened or the send() flag is unset, then return.
    if (this.readyState !== this.OPENED || !this.isSending) {
      return;
    }

    // fetch req. Handle the tasks queued on the networking task source per below
    // run these subsubsteps in parallel:
    // wait until either req’s done flag is set or
    // the timeout attribute value number of milliseconds has passed since these subsubsteps started
    // while timeout attribute value is not zero
    // if req’s done flag is unset, then set the timed out flag and terminate fetching

    if (this._timeout !== 0) {
      // @ts-ignore: wants a NodeJS.Timer because of @types/node
      this._timeoutTimer = setTimeout(() => {
        this.isTimedOut = true;
        this.handleError();
      }, this._timeout);
    }

    try {
      const res = await handleAsync(
        MockXMLHttpRequest.handlers,
        this.req,
        this.res
      );

      //we've received a response before the timeout so we don't want to timeout
      clearTimeout(this._timeoutTimer);

      if (this.isAborted || this.isTimedOut) {
        return; // these cases will already have been handled
      }

      this.sendRequest(req);
      this.receiveResponse(res);
    } catch (error) {
      //we've received an error before the timeout so we don't want to timeout
      clearTimeout(this._timeoutTimer);

      if (this.isAborted || this.isTimedOut) {
        return; // these cases will already have been handled
      }

      MockXMLHttpRequest.errorCallback({req: this.req, err: error});
      this.handleError(error);
    }
  }

  private applyNetworkError() {
    // a network error is a response whose status is always 0, status message is always the
    // empty byte sequence, header list is always empty, body is always null, and
    // trailer is always empty
    this.res
      .status(0)
      .reason('')
      .headers({})
      .body(null);
  }

  // @see https://xhr.spec.whatwg.org/#request-error-steps
  private reportError(event: string) {
    // set state to done
    this.readyState = this.DONE;

    // unset the send() flag
    this.isSending = false;

    // set response to network error
    this.applyNetworkError();

    // if the synchronous flag is set, throw an exception exception
    if (this.isSynchronous) {
      throw new Error(
        'xhr-mock: An error occurred whilst sending a synchronous request.'
      );
    }

    // fire an event named readystatechange
    this.dispatchEvent(new MockEvent('readystatechange'));

    // if the upload complete flag is unset, follow these substeps:
    if (!this.isUploadComplete) {
      // set the upload complete flag
      this.isUploadComplete = true;

      // if upload listener flag is unset, then terminate these substeps
      // NOTE: not sure why this is necessary - if there's no listeners  listening, then the
      // following events have no impact

      const uploadProgress = calculateProgress(this.req);

      // fire a progress event named event on the XMLHttpRequestUpload object with 0 and 0
      this.upload.dispatchEvent(new MockProgressEvent(event, uploadProgress));

      // fire a progress event named loadend on the XMLHttpRequestUpload object with 0 and 0
      this.upload.dispatchEvent(
        new MockProgressEvent('loadend', uploadProgress)
      );
    }

    const downloadProgress = calculateProgress(this.res);

    // fire a progress event named event with 0 and 0
    this.dispatchEvent(new MockProgressEvent(event, downloadProgress));

    // fire a progress event named loadend with 0 and 0
    this.dispatchEvent(new MockProgressEvent('loadend', downloadProgress));
  }

  private sendRequest(req: MockRequest) {
    if (this.isUploadComplete) {
      return;
    }

    // if not roughly 50ms have passed since these subsubsteps were last invoked, terminate these subsubsteps
    // TODO:

    // If upload listener flag is set, then fire a progress event named progress on the
    // XMLHttpRequestUpload object with request’s body’s transmitted bytes and request’s body’s
    // total bytes
    // const progress = getProgress(this.req);
    // this.upload.dispatchEvent(new MockProgressEvent('progress', {
    //   ...progress,
    //   loaded: %
    // }))
    // TODO: repeat this in a timeout to simulate progress events
    // TODO: dispatch total, length and lengthComputable values

    // set the upload complete flag
    this.isUploadComplete = true;

    // if upload listener flag is unset, then terminate these subsubsteps.
    // NOTE: it doesn't really matter if we emit these events and noone is listening

    // let transmitted be request’s body’s transmitted bytes
    // let length be request’s body’s total bytes
    const progress = calculateProgress(this.req);

    // fire a progress event named progress on the XMLHttpRequestUpload object with transmitted and length
    this.upload.dispatchEvent(new MockProgressEvent('progress', progress));

    // fire a progress event named load on the XMLHttpRequestUpload object with transmitted and length
    this.upload.dispatchEvent(new MockProgressEvent('load', progress));

    // fire a progress event named loadend on the XMLHttpRequestUpload object with transmitted and length
    this.upload.dispatchEvent(new MockProgressEvent('loadend', progress));
  }

  private receiveResponse(res: MockResponse) {
    // set state to headers received
    this.readyState = this.HEADERS_RECEIVED;

    // fire an event named readystatechange
    this.dispatchEvent(new MockEvent('readystatechange'));

    // if state is not headers received, then return
    // NOTE: is that really necessary, we've just change the state a second ago

    // if response’s body is null, then run handle response end-of-body and return
    if (res.body() === null) {
      this.handleResponseBody(res);
      return;
    }

    // let reader be the result of getting a reader from response’s body’s stream
    // let read be the result of reading a chunk from response’s body’s stream with reader
    // When read is fulfilled with an object whose done property is false and whose value property
    // is a Uint8Array object, run these subsubsubsteps and then run the above subsubstep again:
    // TODO:

    // append the value property to received bytes

    // if not roughly 50ms have passed since these subsubsubsteps were last invoked, then terminate
    // these subsubsubsteps
    // TODO:

    // if state is headers received, then set state to loading
    // NOTE: why wouldn't it be headers received?
    this.readyState = this.LOADING;

    // fire an event named readystatechange
    this.dispatchEvent(new MockEvent('readystatechange'));

    // fire a progress event named progress with response’s body’s transmitted bytes and response’s
    // body’s total bytes
    // TODO: repeat to simulate progress
    // const progress = calculateProgress(res);
    // this.dispatchEvent(new MockProgressEvent('progress', {
    //   ...progress,
    //   loaded: %
    // }));

    // when read is fulfilled with an object whose done property is true, run handle response
    // end-of-body for response
    // when read is rejected with an exception, run handle errors for response
    // NOTE: we don't handle this error case
    this.handleResponseBody(res);
  }

  // @see https://xhr.spec.whatwg.org/#handle-errors
  private handleError(error?: Error) {
    // if the send() flag is unset, return
    if (!this.isSending) {
      return;
    }

    // if the timed out flag is set, then run the request error steps for event timeout and exception TimeoutError
    if (this.isTimedOut) {
      this.reportError('timeout');
      return;
    }

    // otherwise, if response’s body’s stream is errored, then:
    // NOTE: we're not handling this event
    // if () {

    //   // set state to done
    //   this.readyState = this.DONE;

    //   // unset the send() flag
    //   this.isSending = false;

    //   // set response to a network error
    //   this.applyNetworkError();

    //   return;
    // }

    // otherwise, if response’s aborted flag is set, then run the request error steps for event abort and exception AbortError
    if (this.isAborted) {
      this.reportError('abort');
      return;
    }

    // if response is a network error, run the request error steps for event error and exception NetworkError
    // NOTE: we assume all other calls are network errors
    this.reportError('error');
  }

  // @see https://xhr.spec.whatwg.org/#handle-response-end-of-body
  private handleResponseBody(res: MockResponse) {
    this.res = res;

    // let transmitted be response’s body’s transmitted bytes
    // let length be response’s body’s total bytes.
    const progress = calculateProgress(res);

    // if the synchronous flag is unset, update response’s body using response
    if (!this.isSynchronous) {
      // fire a progress event named progress with transmitted and length
      this.dispatchEvent(new MockProgressEvent('progress', progress));
    }

    // set state to done
    this.readyState = this.DONE;

    // unset the send() flag
    this.isSending = false;

    // fire an event named readystatechange
    this.dispatchEvent(new MockEvent('readystatechange'));

    // fire a progress event named load with transmitted and length
    this.dispatchEvent(new MockProgressEvent('load', progress));

    // fire a progress event named loadend with transmitted and length
    this.dispatchEvent(new MockProgressEvent('loadend', progress));
  }

  // https://xhr.spec.whatwg.org/#event-xhr-loadstart
  send(): void;
  send(body?: any): void;
  send(body?: any): void {
    // if state is not opened, throw an InvalidStateError exception
    if (this.readyState !== MockXMLHttpRequest.OPENED) {
      throw new Error(
        'xhr-mock: Please call MockXMLHttpRequest.open() before MockXMLHttpRequest.send().'
      );
    }

    // if the send() flag is set, throw an InvalidStateError exception
    if (this.isSending) {
      throw new Error(
        'xhr-mock: MockXMLHttpRequest.send() has already been called.'
      );
    }

    // if the request method is GET or HEAD, set body to null
    if (this.req.method() === 'GET' || this.req.method() === 'HEAD') {
      body = null;
    }

    // if body is null, go to the next step otherwise, let encoding and mimeType be null, and then follow these rules, switching on body
    let encoding;
    let mimeType;
    if (body !== null && body !== undefined) {
      if (body instanceof Document) {
        // Set encoding to `UTF-8`.
        // Set mimeType to `text/html` if body is an HTML document, and to `application/xml` otherwise. Then append `;charset=UTF-8` to mimeType.
        // Set request body to body, serialized, converted to Unicode, and utf-8 encoded.
        encoding = 'UTF-8';
        mimeType =
          body instanceof XMLDocument ? 'application/xml' : 'text/html';
      } else {
        // If body is a string, set encoding to `UTF-8`.
        // Set request body and mimeType to the result of extracting body.
        // https://fetch.spec.whatwg.org/#concept-bodyinit-extract

        if (body instanceof Blob) {
          mimeType = body.type;
        } else if (body instanceof FormData) {
          mimeType = 'multipart/form-data; boundary=----XHRMockFormBoundary';
        } else if (body instanceof URLSearchParams) {
          encoding = 'UTF-8';
          mimeType = 'application/x-www-form-urlencoded';
        } else if (typeof body === 'string') {
          encoding = 'UTF-8';
          mimeType = 'text/plain';
        } else {
          throw notImplementedError;
        }
      }

      // if mimeType is non-null and author request headers does not contain `Content-Type`, then append `Content-Type`/mimeType to author request headers.
      // otherwise, if the header whose name is a byte-case-insensitive match for `Content-Type` in author request headers has a value that is a valid MIME type,
      //    which has a `charset` parameter whose value is not a byte-case-insensitive match for encoding, and encoding is not null, then set all the `charset` parameters
      //    whose value is not a byte-case-insensitive match for encoding of that header’s value to encoding.
      // chrome seems to forget the second case ^^^
      const contentType = this.req.header('content-type');
      if (!contentType) {
        this.req.header(
          'content-type',
          encoding ? `${mimeType}; charset=${encoding}` : mimeType
        );
      }

      this.req.body(body);
    }

    // if one or more event listeners are registered on the associated XMLHttpRequestUpload object, then set upload listener flag
    // Note: not really necessary since dispatching an event to no listeners doesn't hurt anybody

    //TODO: check CORs

    // unset the upload complete flag
    this.isUploadComplete = false;

    // unset the timed out flag
    this.isTimedOut = false;

    // if req’s body is null, set the upload complete flag
    if (body === null || body === undefined) {
      this.isUploadComplete = true;
    }

    // set the send() flag
    this.isSending = true;

    if (this.isSynchronous) {
      this.sendSync();
    } else {
      this.sendAsync();
    }
  }

  abort(): void {
    //we've cancelling the response before the timeout period so we don't want to timeout
    clearTimeout(this._timeoutTimer);

    // terminate the ongoing fetch with the aborted flag set
    this.isAborted = true;

    // if state is either opened with the send() flag set, headers received, or loading,
    // run the request error steps for event
    if (
      this.readyState === this.OPENED ||
      this.readyState === this.HEADERS_RECEIVED ||
      this.readyState === this.LOADING
    ) {
      this.reportError('abort');
    }

    // if state is done, then set state to unsent and response to a network error
    if (this.readyState === this.DONE) {
      this.readyState = this.UNSENT;
      this.applyNetworkError();
      return;
    }
  }

  msCachingEnabled() {
    return false;
  }
}
