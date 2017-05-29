import URL from 'url-parse';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';
import MockEventTarget from './MockEventTarget';

const notImplementedError = new Error(
  "This feature hasn't been implmented yet. Please submit an Issue or Pull Request on Github."
);

//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
//http://www.w3.org/TR/2006/WD-XMLHttpRequest-20060405/
// https://xhr.spec.whatwg.org/

const FORBIDDEN_METHODS = ['CONNECT', 'TRACE', 'TRACK'];

export default class MockXMLHttpRequest extends MockEventTarget {
  static UNSENT = 0;
  static OPENED = 1;
  static HEADERS_RECEIVED = 2;
  static LOADING = 3;
  static DONE = 4;

  /** @private */
  static handlers = [];

  /**
   * Add a request handler
   * @param   {function(MockRequest, MockResponse)} fn
   * @returns {void}
   */
  static addHandler(fn) {
    this.handlers.push(fn);
  }

  /**
   * Remove a request handler
   * @param   {function(MockRequest, MockResponse)} fn
   * @returns {void}
   */
  static removeHandler(fn) {
    throw notImplementedError;
  }

  /**
   * Remove all request handlers
   * @returns {void}
   */
  static removeAllHandlers() {
    this.handlers = [];
  }

  timeout = 0;

  //some libraries (like Mixpanel) use the presence of this field to check if XHR is properly supported
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
  withCredentials = false;

  /** @private */
  _request;

  /** @private */
  _response;

  /** @private */
  _readyState;

  constructor() {
    super();
    this._reset();
  }

  /** @private */
  _reset() {
    this.upload = new MockEventTarget();
    this.status = 0;
    this.statusText = '';
    this.response = '';
    this.responseType = '';
    this.responseText = '';
    this.responseXML = null;

    this._request = new MockRequest(this.upload);
    this._response = new MockResponse(this);
    this._readyState = MockXMLHttpRequest.UNSENT;
  }

  get readyState() {
    return this._readyState;
  }

  set readyState(value) {
    this._readyState = value;
    this.dispatchEvent('readystatechange');
  }

  getAllResponseHeaders() {
    if (this.readyState < MockXMLHttpRequest.HEADERS_RECEIVED) {
      return '';
    }

    const headers = this._response.headers();
    const result = Object.keys(headers)
      .map(name => `${name}: ${headers[name]}\r\n`)
      .join('');

    return result;
  }

  getResponseHeader(name) {
    if (this.readyState < MockXMLHttpRequest.HEADERS_RECEIVED) {
      return null;
    }

    return this._response.header(name);
  }

  setRequestHeader(name, value) {
    if (this.readyState < MockXMLHttpRequest.OPENED) {
      throw new Error('xhr-mock: request must be OPENED.');
    }

    this._request.header(name, value);
  }

  overrideMimeType(mime) {
    throw notImplementedError;
  }

  /**
   * @param method
   * @param url
   * @param [async=true]
   * @param [username=null]
   * @param [password=null]
   */
  open(method, url, async = true, username = null, password = null) {
    if (!async) {
      throw new Error(
        'xhr-mock: Synchronous requests are not yet supported. Please submit a PR.'
      );
    }

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
    this._request.method(method).url(fullURL).header('accept', '*/*');

    this.readyState = MockXMLHttpRequest.OPENED;
  }

  /**
   * Handle a request
   * @private
   * @returns {Promise<MockResponse|null>}
   */
  _handleRequest() {
    for (let i = 0; i < MockXMLHttpRequest.handlers.length; ++i) {
      try {
        const result = MockXMLHttpRequest.handlers[i](
          this._request,
          this._response
        );

        if (result) {
          return Promise.resolve(result);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(
      new Error('xhr-mock: No XHR handler returned a response.')
    );
  }

  send(body = null) {
    //readyState must be opened
    if (this.readyState !== MockXMLHttpRequest.OPENED) {
      throw new Error('xhr-mock: Please call .open() before .send().');
    }

    //body is ignored for GET and HEAD requests
    if (this._request.method() === 'get' || this._request.method() === 'head') {
      body = null;
    }

    //TODO: extract body and content-type https://fetch.spec.whatwg.org/#concept-bodyinit-extract
    this._request.body(body);

    //dispatch a timeout event if we haven't received a response in the specified amount of time
    // - we actually wait for the timeout amount of time because many packages like jQuery and Superagent
    // use setTimeout() to artificially detect a timeout rather than using the native timeout event
    //TODO: handle timeout being changed mid-request
    if (this.timeout) {
      this._timeoutTimer = setTimeout(() => {
        this.readyState = MockXMLHttpRequest.DONE;
        this.dispatchEvent('timeout');
      }, this.timeout);
    }

    //indicate the request has started being sent
    this.dispatchEvent('loadstart');
    if (body) {
      this.upload.dispatchEvent('loadstart');
    }

    //indicate request progress
    if (body) {
      const lengthComputable = true;
      const total = body ? body.length : 0;
      this.upload.dispatchEvent({
        type: 'progress',
        lengthComputable,
        loaded: 0,
        total
      });
    }

    this._handleRequest().then(
      res => {
        //we've got a response before the timeout period so we don't want to timeout
        clearTimeout(this._timeoutTimer);

        //TODO: check if we've been aborted

        //indicate the request body has been fully sent
        if (body) {
          this.upload.dispatchEvent({
            type: 'progress',
            lengthComputable,
            loaded: total,
            total
          });
          this.upload.dispatchEvent('load');
          this.upload.dispatchEvent('loadend');
        }

        //set the response headers on the XHR object
        this._response = res;
        this.status = res.status();
        this.statusText = res.reason();
        this.responseType = 'text';
        this.readyState = MockXMLHttpRequest.HEADERS_RECEIVED;

        //set the response body on the XHR object (note: it should only be partial data here)
        this.response = res.body(); //TODO: detect an object and return JSON, detect XML and return XML
        this.responseText = String(res.body());
        this.readyState = MockXMLHttpRequest.LOADING;

        //indicate response progress
        //FIXME: response.progress() shouldn't be called before here
        const lengthComputable = Boolean(res.header('content-length'));
        const total = res.header('content-length') || 0;
        this.dispatchEvent({
          type: 'progress',
          lengthComputable,
          loaded: 0,
          total
        });
        //FIXME: allow user to specify custom progress here
        this.dispatchEvent({
          type: 'progress',
          lengthComputable,
          loaded: res.body() ? res.body().length : 0,
          total
        });

        //indicate the response has been fully received
        this.readyState = MockXMLHttpRequest.DONE;
        this.dispatchEvent('load');
        this.dispatchEvent('loadend');
      },
      error => {
        //we've got a response before the timeout period so we don't want to timeout
        clearTimeout(this._timeoutTimer);

        this.readyState = MockXMLHttpRequest.DONE;
        this.dispatchEvent({type: 'error', error});
      }
    );
  }

  abort() {
    //FIXME: according to spec

    //we've cancelling the response before the timeout period so we don't want to timeout
    clearTimeout(this._timeoutTimer);

    if (
      this.readyState > MockXMLHttpRequest.OPENED &&
      this.readyState < MockXMLHttpRequest.DONE
    ) {
      // this.readyState = MockXMLHttpRequest.UNSENT; //FIXME
      this.upload.dispatchEvent('abort');
      this.dispatchEvent('abort');
    }
  }
}
