'use strict';
exports.__esModule = true;
var router_1 = require('../router');
var MockXMLHttpRequest_1 = require('./MockXMLHttpRequest');
function failOnEvent(done) {
  return function(event) {
    done.fail();
  };
}
function successOnEvent(done) {
  return function(event) {
    done();
  };
}
var createXHR = function() {
  var events = [];
  var router = new router_1.MockRouter();
  var xhr = new MockXMLHttpRequest_1.MockXMLHttpRequest(router);
  // mute logging of successful requests
  router.after(undefined);
  // record upload events
  var pushDownloadEvent = function(event) {
    return events.push('xhr:' + event.type + (event.type === 'readystatechange' ? '[' + xhr.readyState + ']' : ''));
  };
  xhr.addEventListener('readystatechange', pushDownloadEvent);
  xhr.addEventListener('loadstart', pushDownloadEvent);
  xhr.addEventListener('progress', pushDownloadEvent);
  xhr.addEventListener('load', pushDownloadEvent);
  xhr.addEventListener('loadend', pushDownloadEvent);
  // record upload events
  var pushUploadEvent = function(event) {
    return events.push('upload:' + event.type);
  };
  xhr.upload.addEventListener('loadstart', pushUploadEvent);
  xhr.upload.addEventListener('progress', pushUploadEvent);
  xhr.upload.addEventListener('load', pushUploadEvent);
  xhr.upload.addEventListener('loadend', pushUploadEvent);
  return {events: events, router: router, xhr: xhr};
};
describe('MockXMLHttpRequest', function() {
  describe('.response', function() {
    it('should return an empty string when type is empty string and the request is not loading and is not done', function() {
      var xhr = createXHR().xhr;
      xhr.responseType = '';
      xhr.open('get', '/');
      expect(xhr.response).toEqual('');
    });
    it('should return an empty string when type is text and the request is not loading and is not done', function() {
      var xhr = createXHR().xhr;
      xhr.responseType = 'text';
      xhr.open('get', '/');
      expect(xhr.response).toEqual('');
    });
    it('should return the responseText when type is empty string and the request is done', function(done) {
      var _a = createXHR(),
        router = _a.router,
        xhr = _a.xhr;
      router.use(function(req) {
        return {body: 'Hello World!'};
      });
      xhr.responseType = '';
      xhr.onload = function() {
        expect(xhr.response).toEqual('Hello World!');
        done();
      };
      xhr.onerror = failOnEvent(done);
      xhr.open('get', '/');
      xhr.send();
    });
    it('should return the responseText when type is text and the request is done', function(done) {
      var _a = createXHR(),
        router = _a.router,
        xhr = _a.xhr;
      router.use(function(req, res) {
        return {body: 'Hello World!'};
      });
      xhr.responseType = '';
      xhr.onload = function() {
        expect(xhr.response).toEqual('Hello World!');
        done();
      };
      xhr.onerror = failOnEvent(done);
      xhr.open('get', '/');
      xhr.send();
    });
    it('should return null when type is json and the request is not done', function() {
      var _a = createXHR(),
        router = _a.router,
        xhr = _a.xhr;
      router.use(function(req) {
        return {body: '{}'};
      });
      xhr.responseType = 'json';
      xhr.open('get', '/');
      expect(xhr.response).toEqual(null);
    });
    it('should return json when the type is json and the request is done', function(done) {
      var _a = createXHR(),
        router = _a.router,
        xhr = _a.xhr;
      router.use(function(req) {
        return {body: '{"foo": "bar"}'};
      });
      xhr.responseType = 'json';
      xhr.onload = function() {
        try {
          expect(xhr.response).toEqual({foo: 'bar'});
          done();
        } catch (error) {
          done.fail(error);
        }
      };
      xhr.onerror = failOnEvent(done);
      xhr.open('get', '/');
      xhr.send();
    });
    it('should return null when the type is other and the request is not done', function() {
      var fakeBuffer = {};
      var _a = createXHR(),
        router = _a.router,
        xhr = _a.xhr;
      router.use(function(req) {
        return {body: fakeBuffer};
      });
      xhr.responseType = 'blob';
      xhr.open('get', '/');
      expect(xhr.response).toEqual(null);
    });
    it('should return an object when the type is other and the request is done', function(done) {
      var fakeBuffer = {};
      var _a = createXHR(),
        router = _a.router,
        xhr = _a.xhr;
      router.use(function(req) {
        return {body: fakeBuffer};
      });
      xhr.responseType = 'blob';
      xhr.onload = function() {
        try {
          expect(xhr.response).toBe(fakeBuffer);
          done();
        } catch (error) {
          done.fail(error);
        }
      };
      xhr.onerror = failOnEvent(done);
      xhr.open('get', '/');
      xhr.send();
    });
  });
  describe('.setRequestHeader()', function() {
    it('should set a header', function(done) {
      expect.assertions(1);
      var _a = createXHR(),
        router = _a.router,
        xhr = _a.xhr;
      router.use(function(req, res) {
        expect(req.headers['content-type']).toEqual('application/json');
        return {};
      });
      xhr.open('GET', '/');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = successOnEvent(done);
      xhr.onerror = failOnEvent(done);
      xhr.send();
    });
  });
  describe('.getResponseHeader()', function() {
    it('should have a response header', function(done) {
      expect.assertions(1);
      var _a = createXHR(),
        router = _a.router,
        xhr = _a.xhr;
      router.use(function(req, res) {
        return {headers: {'Content-Type': 'application/json'}};
      });
      xhr.open('get', '/');
      xhr.onloadend = function() {
        expect(xhr.getResponseHeader('Content-Type')).toEqual('application/json');
        done();
      };
      xhr.onerror = failOnEvent(done);
      xhr.send();
    });
  });
  describe('.getAllResponseHeaders()', function() {
    it('should have return headers as a string', function(done) {
      var _a = createXHR(),
        router = _a.router,
        xhr = _a.xhr;
      router.use(function(req, res) {
        return {
          headers: {
            'Content-Type': 'application/json',
            'X-Powered-By': 'SecretSauce'
          }
        };
      });
      xhr.open('get', '/');
      xhr.onload = function() {
        expect(xhr.getAllResponseHeaders()).toEqual('content-type: application/json\r\nx-powered-by: SecretSauce\r\n');
        done();
      };
      xhr.onerror = failOnEvent(done);
      xhr.send();
    });
  });
  describe('.constructor()', function() {
    it('should set .readyState to UNSENT', function() {
      var xhr = createXHR().xhr;
      expect(xhr.readyState).toEqual(MockXMLHttpRequest_1.MockXMLHttpRequest.UNSENT);
    });
  });
  describe('.open()', function() {
    it('should set .readyState to OPEN', function() {
      var xhr = createXHR().xhr;
      xhr.open('get', '/');
      expect(xhr.readyState).toEqual(MockXMLHttpRequest_1.MockXMLHttpRequest.OPENED);
    });
    it('should call .onreadystatechange', function() {
      var callback = jest.fn();
      var xhr = createXHR().xhr;
      xhr.onreadystatechange = callback;
      xhr.open('get', '/');
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
  describe('.send()', function() {
    it('should throw an error when .open() has not been called', function() {
      var xhr = createXHR().xhr;
      expect(function() {
        return xhr.send();
      }).toThrow();
    });
    describe('async=false', function() {
      it('should dispatch events in order when both the request and response do not contain a body', function() {
        var _a = createXHR(),
          events = _a.events,
          router = _a.router,
          xhr = _a.xhr;
        router.use(function(req) {
          return {};
        });
        xhr.open('get', '/', false);
        xhr.send();
        expect(events).toEqual(['xhr:readystatechange[1]', 'xhr:readystatechange[4]', 'xhr:load', 'xhr:loadend']);
      });
      it('should dispatch events in order when request has a body', function() {
        var _a = createXHR(),
          events = _a.events,
          router = _a.router,
          xhr = _a.xhr;
        router.use(function(req) {
          return {};
        });
        xhr.open('put', '/', false);
        xhr.send('hello world!');
        expect(events).toEqual(['xhr:readystatechange[1]', 'xhr:readystatechange[4]', 'xhr:load', 'xhr:loadend']);
      });
      it('should dispatch events in order when response has a body', function() {
        var _a = createXHR(),
          events = _a.events,
          router = _a.router,
          xhr = _a.xhr;
        router.use(function(req) {
          return {body: 'Hello World'};
        });
        xhr.open('put', '/', false);
        xhr.send();
        expect(events).toEqual(['xhr:readystatechange[1]', 'xhr:readystatechange[4]', 'xhr:load', 'xhr:loadend']);
      });
    });
  });
  describe('async=true', function() {
    it('should dispatch events in order when both the request and response do not contain a body', function(done) {
      var _a = createXHR(),
        events = _a.events,
        router = _a.router,
        xhr = _a.xhr;
      router.use(function(req) {
        return {};
      });
      xhr.open('get', '/');
      xhr.onloadend = function() {
        expect(events).toEqual([
          'xhr:readystatechange[1]',
          'xhr:loadstart',
          'xhr:readystatechange[2]',
          'xhr:readystatechange[3]',
          'xhr:progress',
          'xhr:readystatechange[4]',
          'xhr:load'
        ]);
        done();
      };
      xhr.send();
    });
    it('should dispatch events in order when request has a body', function(done) {
      var _a = createXHR(),
        events = _a.events,
        router = _a.router,
        xhr = _a.xhr;
      router.use(function(req) {
        return {};
      });
      xhr.open('put', '/');
      xhr.onloadend = function() {
        expect(events).toEqual([
          'xhr:readystatechange[1]',
          'xhr:loadstart',
          'upload:loadstart',
          'upload:progress',
          'upload:load',
          'upload:loadend',
          'xhr:readystatechange[2]',
          'xhr:readystatechange[3]',
          'xhr:progress',
          'xhr:readystatechange[4]',
          'xhr:load'
        ]);
        done();
      };
      xhr.send('hello world!');
    });
    it('should dispatch events in order when response has a body', function(done) {
      var _a = createXHR(),
        events = _a.events,
        router = _a.router,
        xhr = _a.xhr;
      router.use(function(req) {
        return {body: 'Hello World'};
      });
      xhr.open('put', '/');
      xhr.onloadend = function() {
        expect(events).toEqual([
          'xhr:readystatechange[1]',
          'xhr:loadstart',
          'xhr:readystatechange[2]',
          'xhr:readystatechange[3]',
          'xhr:progress',
          'xhr:readystatechange[4]',
          'xhr:load'
        ]);
        done();
      };
      xhr.send();
    });
  });
  //TODO: check values of all events
  it('should set the request body when .send() is called with a body', function(done) {
    var _a = createXHR(),
      router = _a.router,
      xhr = _a.xhr;
    router.use(function(req) {
      expect(req.body).toEqual('Hello World!');
      return {};
    });
    xhr.onload = successOnEvent(done);
    xhr.onerror = failOnEvent(done);
    xhr.open('post', '/');
    xhr.send('Hello World!');
  });
  it('should not set the request body when .send() is not called with a body', function(done) {
    var _a = createXHR(),
      router = _a.router,
      xhr = _a.xhr;
    router.use(function(req) {
      expect(req.body).toBeUndefined();
      return {};
    });
    xhr.onload = successOnEvent(done);
    xhr.onerror = failOnEvent(done);
    xhr.open('get', '/');
    xhr.send();
  });
  it('should time out when .timeout > 0 and no response is resloved within the time', function(done) {
    var start, end;
    var _a = createXHR(),
      router = _a.router,
      xhr = _a.xhr;
    router.use(function(req) {
      return new Promise(function() {
        /* do nothing */
      });
    });
    xhr.timeout = 100;
    xhr.ontimeout = function() {
      end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(100);
      expect(xhr.readyState).toEqual(4);
      done();
    };
    xhr.onerror = failOnEvent(done);
    start = Date.now();
    xhr.open('get', '/');
    xhr.send();
  });
  it('should not time out when .timeout > 0 and the request was aborted', function(done) {
    var _a = createXHR(),
      router = _a.router,
      xhr = _a.xhr;
    router.use(function(req) {
      return new Promise(function() {
        /* do nothing */
      });
    });
    xhr.timeout = 100;
    xhr.ontimeout = failOnEvent(done);
    xhr.onabort = successOnEvent(done);
    xhr.onerror = failOnEvent(done);
    xhr.open('get', '/');
    xhr.send();
    xhr.abort();
  });
  it('should not time out when .timeout > 0 and the request errored', function(done) {
    var _a = createXHR(),
      router = _a.router,
      xhr = _a.xhr;
    router.error(undefined);
    router.use(function(req) {
      return Promise.reject(new Error('test!'));
    });
    xhr.timeout = 100;
    xhr.ontimeout = failOnEvent(done);
    xhr.onerror = successOnEvent(done);
    xhr.open('get', '/');
    xhr.send();
  });
  it('should set the request Content-Type header when the request Content-Type header has not been set and a body has been provided', function(done) {
    var _a = createXHR(),
      router = _a.router,
      xhr = _a.xhr;
    router.use(function(req) {
      return {
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8'
        }
      };
    });
    xhr.onload = successOnEvent(done);
    xhr.onerror = failOnEvent(done);
    xhr.open('post', '/');
    xhr.send('hello world!');
  });
  it('should not set the request Content-Type header when the request Content-Type header has been set and a body has been provided', function(done) {
    var _a = createXHR(),
      router = _a.router,
      xhr = _a.xhr;
    router.use(function(req) {
      return {
        headers: {
          'Content-Type': 'foo/bar'
        }
      };
    });
    xhr.onload = successOnEvent(done);
    xhr.onerror = failOnEvent(done);
    xhr.open('post', '/');
    xhr.setRequestHeader('content-type', 'foo/bar');
    xhr.send('hello world!');
  });
  it('should be able to send another request after the previous request errored', function(done) {
    var _a = createXHR(),
      router = _a.router,
      xhr = _a.xhr;
    router.error(undefined);
    router.use(function(req) {
      return Promise.reject(new Error('test!'));
    });
    xhr.timeout = 100;
    xhr.ontimeout = failOnEvent(done);
    xhr.onerror = function() {
      try {
        xhr.open('get', '/');
        xhr.send();
        xhr.abort();
        done();
      } catch (err) {
        done.fail(err);
      }
    };
    xhr.open('get', '/');
    xhr.send();
  });
});
