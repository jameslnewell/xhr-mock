'use strict';
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({__proto__: []} instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = {next: verb(0), throw: verb(1), return: verb(2)}),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {value: op[1], done: false};
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return {value: op[0] ? op[1] : void 0, done: true};
    }
  };
exports.__esModule = true;
var MockError_1 = require('../MockError');
var MockEvent_1 = require('./MockEvent');
var MockProgressEvent_1 = require('./MockProgressEvent');
var MockXMLHttpRequestUpload_1 = require('./MockXMLHttpRequestUpload');
var MockXMLHttpRequestEventTarget_1 = require('./MockXMLHttpRequestEventTarget');
var notImplementedError = new MockError_1.MockError(
  "This feature hasn't been implmented yet. Please submit an Issue or Pull Request on Github."
);
// implemented according to https://xhr.spec.whatwg.org/
var FORBIDDEN_METHODS = ['CONNECT', 'TRACE', 'TRACK'];
var ReadyState;
(function(ReadyState) {
  ReadyState[(ReadyState['UNSENT'] = 0)] = 'UNSENT';
  ReadyState[(ReadyState['OPENED'] = 1)] = 'OPENED';
  ReadyState[(ReadyState['HEADERS_RECEIVED'] = 2)] = 'HEADERS_RECEIVED';
  ReadyState[(ReadyState['LOADING'] = 3)] = 'LOADING';
  ReadyState[(ReadyState['DONE'] = 4)] = 'DONE';
})((ReadyState = exports.ReadyState || (exports.ReadyState = {})));
function calculateProgress(req) {
  var header = req.headers['content-length'];
  var body = req.body;
  var lengthComputable = false;
  var total = 0;
  if (header) {
    var contentLength = parseInt(header, 10);
    if (contentLength !== NaN) {
      lengthComputable = true;
      total = contentLength;
    }
  }
  return {
    lengthComputable: lengthComputable,
    loaded: (body && body.length) || 0,
    total: total
  };
}
// @ts-ignore: https://github.com/jameslnewell/xhr-mock/issues/45
var MockXMLHttpRequest = /** @class */ (function(_super) {
  __extends(MockXMLHttpRequest, _super);
  function MockXMLHttpRequest(router) {
    if (router === void 0) {
      router = defaultRouter;
    }
    var _this = _super.call(this) || this;
    _this.UNSENT = ReadyState.UNSENT;
    _this.OPENED = ReadyState.OPENED;
    _this.HEADERS_RECEIVED = ReadyState.HEADERS_RECEIVED;
    _this.LOADING = ReadyState.LOADING;
    _this.DONE = ReadyState.DONE;
    //some libraries (like Mixpanel) use the presence of this field to check if XHR is properly supported
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
    _this.withCredentials = false;
    _this.req = {
      version: '1.1',
      method: 'GET',
      uri: '',
      headers: {},
      body: undefined
    };
    _this.res = {
      version: '1.1',
      status: 200,
      reason: 'OK',
      headers: {},
      body: undefined
    };
    _this.responseType = '';
    _this.responseURL = '';
    _this._timeout = 0;
    // @ts-ignore: https://github.com/jameslnewell/xhr-mock/issues/45
    _this.upload = new MockXMLHttpRequestUpload_1.MockXMLHttpRequestUpload();
    _this.readyState = MockXMLHttpRequest.UNSENT;
    // flags
    _this.isSynchronous = false;
    _this.isSending = false;
    _this.isUploadComplete = false;
    _this.isAborted = false;
    _this.isTimedOut = false;
    _this.router = router;
    return _this;
  }
  Object.defineProperty(MockXMLHttpRequest.prototype, 'timeout', {
    get: function() {
      return this._timeout;
    },
    set: function(timeout) {
      if (timeout !== 0 && this.isSynchronous) {
        throw new MockError_1.MockError('Timeouts cannot be set for synchronous requests made from a document.');
      }
      this._timeout = timeout;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(MockXMLHttpRequest.prototype, 'response', {
    // https://xhr.spec.whatwg.org/#the-response-attribute
    get: function() {
      if (this.responseType === '' || this.responseType === 'text') {
        if (this.readyState !== this.LOADING && this.readyState !== this.DONE) {
          return '';
        }
        return this.responseText;
      }
      if (this.readyState !== this.DONE) {
        return null;
      }
      var body = this.res.body;
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
      return body || null;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(MockXMLHttpRequest.prototype, 'responseText', {
    get: function() {
      return this.res.body || '';
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(MockXMLHttpRequest.prototype, 'responseXML', {
    get: function() {
      throw notImplementedError;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(MockXMLHttpRequest.prototype, 'status', {
    get: function() {
      return this.res.status;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(MockXMLHttpRequest.prototype, 'statusText', {
    get: function() {
      return this.res.reason;
    },
    enumerable: true,
    configurable: true
  });
  MockXMLHttpRequest.prototype.getAllResponseHeaders = function() {
    // I'm pretty sure this fn can return null, but TS types say no
    // if (this.readyState < MockXMLHttpRequest.HEADERS_RECEIVED) {
    //   return null;
    // }
    var headers = this.res.headers;
    var result = Object.keys(headers)
      .map(function(name) {
        return name + ': ' + headers[name] + '\r\n';
      })
      .join('');
    return result;
  };
  MockXMLHttpRequest.prototype.getResponseHeader = function(name) {
    if (this.readyState < MockXMLHttpRequest.HEADERS_RECEIVED) {
      return null;
    }
    return this.res.headers[name.toLowerCase()];
  };
  MockXMLHttpRequest.prototype.setRequestHeader = function(name, value) {
    if (this.readyState < MockXMLHttpRequest.OPENED) {
      throw new MockError_1.MockError('xhr must be OPENED.');
    }
    this.req.headers[name] = value;
  };
  MockXMLHttpRequest.prototype.overrideMimeType = function(mime) {
    throw notImplementedError;
  };
  MockXMLHttpRequest.prototype.open = function(method, url, async, username, password) {
    if (async === void 0) {
      async = true;
    }
    if (username === void 0) {
      username = null;
    }
    if (password === void 0) {
      password = null;
    }
    // if method is not a method, then throw a "SyntaxError" DOMException
    // if method is a forbidden method, then throw a "SecurityError" DOMException
    if (FORBIDDEN_METHODS.indexOf(method) !== -1) {
      throw new MockError_1.MockError('Method ' + method + ' is forbidden.');
    }
    // let parsedURL be the result of parsing url with settingsObject’s API base URL and settingsObject’s API URL character encoding
    // if parsedURL is failure, then throw a "SyntaxError" DOMException
    // const fullURL = parseURL(url);
    // if the async argument is omitted, set async to true, and set username and password to null.
    // if parsedURL’s host is non-null, run these substeps:
    // if the username argument is not null, set the username given parsedURL and username
    // if the password argument is not null, set the password given parsedURL and password
    // fullURL.username = username || '';
    // fullURL.password = (username && password) || '';
    // if async is false, current global object is a Window object, and the timeout attribute value
    // is not zero or the responseType attribute value is not the empty string, then throw an "InvalidAccessError" DOMException.
    if (!async && (this._timeout !== 0 || this.responseType !== '')) {
      throw new MockError_1.MockError('InvalidAccessError');
    }
    // terminate the ongoing fetch operated by the XMLHttpRequest object
    if (this.isSending) {
      throw new MockError_1.MockError('Unable to terminate the previous request');
    }
    // set variables associated with the object as follows:
    // - unset the send() flag and upload listener flag
    // - set the synchronous flag, if async is false, and unset the synchronous flag otherwise
    // - set request method to method
    // - set request URL to parsedURL
    // - empty author request headers
    this.isSending = false;
    this.isSynchronous = !async;
    this.req = {
      // TODO: normalise
      version: '1.1',
      method: method,
      headers: {},
      uri: url,
      body: undefined
    };
    this.applyNetworkError();
    // if the state is not opened, run these substeps:
    if (this.readyState !== this.OPENED) {
      // set state to opened
      this.readyState = MockXMLHttpRequest.OPENED;
      // fire an event named readystatechange
      this.dispatchEvent(new MockEvent_1.MockEvent('readystatechange'));
    }
  };
  MockXMLHttpRequest.prototype.sendSync = function() {
    // let response be the result of fetching req
    var res;
    try {
      res = this.router.routeSync(this.req, {sync: true});
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
      this.handleError(error);
    }
  };
  MockXMLHttpRequest.prototype.sendAsync = function() {
    return __awaiter(this, void 0, void 0, function() {
      var req, progress, progress_1, res, error_1;
      var _this = this;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            req = this.req;
            progress = calculateProgress(this.res);
            this.dispatchEvent(
              new MockProgressEvent_1.MockProgressEvent('loadstart', __assign({}, progress, {loaded: 0}))
            );
            // if the upload complete flag is unset and upload listener flag is set, then fire a progress
            // event named loadstart on the XMLHttpRequestUpload object with 0 and req’s body’s total bytes.
            if (!this.isUploadComplete) {
              progress_1 = calculateProgress(this.req);
              this.upload.dispatchEvent(
                new MockProgressEvent_1.MockProgressEvent('loadstart', __assign({}, progress_1, {loaded: 0}))
              );
            }
            // if state is not opened or the send() flag is unset, then return.
            if (this.readyState !== this.OPENED || !this.isSending) {
              return [2 /*return*/];
            }
            // fetch req. Handle the tasks queued on the networking task source per below
            // run these subsubsteps in parallel:
            // wait until either req’s done flag is set or
            // the timeout attribute value number of milliseconds has passed since these subsubsteps started
            // while timeout attribute value is not zero
            // if req’s done flag is unset, then set the timed out flag and terminate fetching
            if (this._timeout !== 0) {
              // @ts-ignore: wants a NodeJS.Timer because of @types/node
              this._timeoutTimer = setTimeout(function() {
                _this.isTimedOut = true;
                _this.handleError();
              }, this._timeout);
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [4 /*yield*/, this.router.routeAsync(this.req, {sync: false})];
          case 2:
            res = _a.sent();
            //we've received a response before the timeout so we don't want to timeout
            clearTimeout(this._timeoutTimer);
            if (this.isAborted || this.isTimedOut) {
              return [2 /*return*/]; // these cases will already have been handled
            }
            this.sendRequest(req);
            this.receiveResponse(res);
            return [3 /*break*/, 4];
          case 3:
            error_1 = _a.sent();
            //we've received an error before the timeout so we don't want to timeout
            clearTimeout(this._timeoutTimer);
            if (this.isAborted || this.isTimedOut) {
              return [2 /*return*/]; // these cases will already have been handled
            }
            this.handleError(error_1);
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  MockXMLHttpRequest.prototype.applyNetworkError = function() {
    // a network error is a response whose status is always 0, status message is always the
    // empty byte sequence, header list is always empty, body is always null, and
    // trailer is always empty
    this.res = {
      version: '1.1',
      status: 0,
      reason: '',
      headers: {},
      body: undefined
    };
  };
  // @see https://xhr.spec.whatwg.org/#request-error-steps
  MockXMLHttpRequest.prototype.reportError = function(event) {
    // set state to done
    this.readyState = this.DONE;
    // unset the send() flag
    this.isSending = false;
    // set response to network error
    this.applyNetworkError();
    // if the synchronous flag is set, throw an exception exception
    if (this.isSynchronous) {
      throw new MockError_1.MockError('An error occurred whilst sending a synchronous request.');
    }
    // fire an event named readystatechange
    this.dispatchEvent(new MockEvent_1.MockEvent('readystatechange'));
    // if the upload complete flag is unset, follow these substeps:
    if (!this.isUploadComplete) {
      // set the upload complete flag
      this.isUploadComplete = true;
      // if upload listener flag is unset, then terminate these substeps
      // NOTE: not sure why this is necessary - if there's no listeners  listening, then the
      // following events have no impact
      var uploadProgress = calculateProgress(this.req);
      // fire a progress event named event on the XMLHttpRequestUpload object with 0 and 0
      this.upload.dispatchEvent(new MockProgressEvent_1.MockProgressEvent(event, uploadProgress));
      // fire a progress event named loadend on the XMLHttpRequestUpload object with 0 and 0
      this.upload.dispatchEvent(new MockProgressEvent_1.MockProgressEvent('loadend', uploadProgress));
    }
    var downloadProgress = calculateProgress(this.res);
    // fire a progress event named event with 0 and 0
    this.dispatchEvent(new MockProgressEvent_1.MockProgressEvent(event, downloadProgress));
    // fire a progress event named loadend with 0 and 0
    this.dispatchEvent(new MockProgressEvent_1.MockProgressEvent('loadend', downloadProgress));
  };
  MockXMLHttpRequest.prototype.sendRequest = function(req) {
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
    var progress = calculateProgress(this.req);
    // fire a progress event named progress on the XMLHttpRequestUpload object with transmitted and length
    this.upload.dispatchEvent(new MockProgressEvent_1.MockProgressEvent('progress', progress));
    // fire a progress event named load on the XMLHttpRequestUpload object with transmitted and length
    this.upload.dispatchEvent(new MockProgressEvent_1.MockProgressEvent('load', progress));
    // fire a progress event named loadend on the XMLHttpRequestUpload object with transmitted and length
    this.upload.dispatchEvent(new MockProgressEvent_1.MockProgressEvent('loadend', progress));
  };
  MockXMLHttpRequest.prototype.receiveResponse = function(res) {
    // set state to headers received
    this.readyState = this.HEADERS_RECEIVED;
    // fire an event named readystatechange
    this.dispatchEvent(new MockEvent_1.MockEvent('readystatechange'));
    // if state is not headers received, then return
    // NOTE: is that really necessary, we've just change the state a second ago
    // if response’s body is null, then run handle response end-of-body and return
    if (res.body === null) {
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
    this.dispatchEvent(new MockEvent_1.MockEvent('readystatechange'));
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
  };
  // @see https://xhr.spec.whatwg.org/#handle-errors
  MockXMLHttpRequest.prototype.handleError = function(error) {
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
  };
  // @see https://xhr.spec.whatwg.org/#handle-response-end-of-body
  MockXMLHttpRequest.prototype.handleResponseBody = function(res) {
    this.res = res;
    // let transmitted be response’s body’s transmitted bytes
    // let length be response’s body’s total bytes.
    var progress = calculateProgress(res);
    // if the synchronous flag is unset, update response’s body using response
    if (!this.isSynchronous) {
      // fire a progress event named progress with transmitted and length
      this.dispatchEvent(new MockProgressEvent_1.MockProgressEvent('progress', progress));
    }
    // set state to done
    this.readyState = this.DONE;
    // unset the send() flag
    this.isSending = false;
    // fire an event named readystatechange
    this.dispatchEvent(new MockEvent_1.MockEvent('readystatechange'));
    // fire a progress event named load with transmitted and length
    this.dispatchEvent(new MockProgressEvent_1.MockProgressEvent('load', progress));
    // fire a progress event named loadend with transmitted and length
    this.dispatchEvent(new MockProgressEvent_1.MockProgressEvent('loadend', progress));
  };
  MockXMLHttpRequest.prototype.send = function(body) {
    // if state is not opened, throw an InvalidStateError exception
    if (this.readyState !== MockXMLHttpRequest.OPENED) {
      throw new MockError_1.MockError('Please call MockXMLHttpRequest.open() before MockXMLHttpRequest.send().');
    }
    // if the send() flag is set, throw an InvalidStateError exception
    if (this.isSending) {
      throw new MockError_1.MockError('MockXMLHttpRequest.send() has already been called.');
    }
    // if the request method is GET or HEAD, set body to null
    if (this.req.method === 'GET' || this.req.method === 'HEAD') {
      body = null;
    }
    // if body is null, go to the next step otherwise, let encoding and mimeType be null, and then follow these rules, switching on body
    var encoding;
    var mimeType;
    if (body !== null && body !== undefined) {
      if (typeof Document !== 'undefined' && typeof XMLDocument !== 'undefined' && body instanceof Document) {
        // Set encoding to `UTF-8`.
        // Set mimeType to `text/html` if body is an HTML document, and to `application/xml` otherwise. Then append `;charset=UTF-8` to mimeType.
        // Set request body to body, serialized, converted to Unicode, and utf-8 encoded.
        encoding = 'UTF-8';
        mimeType = body instanceof XMLDocument ? 'application/xml' : 'text/html';
      } else {
        // If body is a string, set encoding to `UTF-8`.
        // Set request body and mimeType to the result of extracting body.
        // https://fetch.spec.whatwg.org/#concept-bodyinit-extract
        if (typeof Blob !== 'undefined' && body instanceof Blob) {
          mimeType = body.type;
        } else if (typeof FormData !== 'undefined' && body instanceof FormData) {
          mimeType = 'multipart/form-data; boundary=----XHRMockFormBoundary';
        } else if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) {
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
      var contentType = this.req.headers['content-type'];
      if (!contentType) {
        this.req.headers['content-type'] = encoding ? mimeType + '; charset=' + encoding : mimeType;
      }
      this.req.body = body;
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
  };
  MockXMLHttpRequest.prototype.abort = function() {
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
  };
  MockXMLHttpRequest.prototype.msCachingEnabled = function() {
    return false;
  };
  MockXMLHttpRequest.UNSENT = ReadyState.UNSENT;
  MockXMLHttpRequest.OPENED = ReadyState.OPENED;
  MockXMLHttpRequest.HEADERS_RECEIVED = ReadyState.HEADERS_RECEIVED;
  MockXMLHttpRequest.LOADING = ReadyState.LOADING;
  MockXMLHttpRequest.DONE = ReadyState.DONE;
  return MockXMLHttpRequest;
})(MockXMLHttpRequestEventTarget_1.MockXMLHttpRequestEventTarget);
exports.MockXMLHttpRequest = MockXMLHttpRequest;
