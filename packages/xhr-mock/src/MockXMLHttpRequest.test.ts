import MockEvent from './MockEvent';
import MockProgressEvent from './MockProgressEvent';
import MockXMLHttpRequest from './MockXMLHttpRequest';
import {MockRequest} from '.';
import {MockError} from './MockError';

function failOnEvent(done: jest.DoneCallback) {
  return function(event: MockProgressEvent) {
    done.fail();
  };
}

function successOnEvent(done: jest.DoneCallback) {
  return function(event: MockProgressEvent) {
    done();
  };
}

function addListeners(xhr: MockXMLHttpRequest, events: string[]) {
  const pushEvent = (event: MockEvent) => events.push(`xhr:${event.type}`);
  xhr.addEventListener('readystatechange', pushEvent);
  xhr.addEventListener('loadstart', pushEvent);
  xhr.addEventListener('progress', pushEvent);
  xhr.addEventListener('load', pushEvent);
  xhr.addEventListener('loadend', pushEvent);

  const uploadPushEvent = (event: MockEvent) =>
    events.push(`upload:${event.type}`);
  xhr.upload.addEventListener('loadstart', uploadPushEvent);
  xhr.upload.addEventListener('progress', uploadPushEvent);
  xhr.upload.addEventListener('load', uploadPushEvent);
  xhr.upload.addEventListener('loadend', uploadPushEvent);
}

describe('MockXMLHttpRequest', () => {
  beforeEach(() => {
    MockXMLHttpRequest.removeAllHandlers();
    MockXMLHttpRequest.errorCallback = () => {
      /* do nothing */
    };
  });

  describe('.response', () => {
    it('should return an empty string when type is empty string and the request is not loading and is not done', () => {
      const xhr = new MockXMLHttpRequest();
      xhr.responseType = '';
      xhr.open('get', '/');
      expect(xhr.response).toEqual('');
    });

    it('should return an empty string when type is text and the request is not loading and is not done', () => {
      const xhr = new MockXMLHttpRequest();
      xhr.responseType = 'text';
      xhr.open('get', '/');
      expect(xhr.response).toEqual('');
    });

    it('should return the responseText when type is empty string and the request is done', done => {
      MockXMLHttpRequest.addHandler((req, res) => res.body('Hello World!'));
      const xhr = new MockXMLHttpRequest();
      xhr.responseType = '';
      xhr.onload = () => {
        expect(xhr.response).toEqual('Hello World!');
        done();
      };
      xhr.onerror = failOnEvent(done);
      xhr.open('get', '/');
      xhr.send();
    });

    it('should return the responseText when type is text and the request is done', done => {
      MockXMLHttpRequest.addHandler((req, res) => res.body('Hello World!'));
      const xhr = new MockXMLHttpRequest();
      xhr.responseType = '';
      xhr.onload = () => {
        expect(xhr.response).toEqual('Hello World!');
        done();
      };
      xhr.onerror = failOnEvent(done);
      xhr.open('get', '/');
      xhr.send();
    });

    it('should return null when type is json and the request is not done', () => {
      MockXMLHttpRequest.addHandler((req, res) => res.body('{}'));
      const xhr = new MockXMLHttpRequest();
      xhr.responseType = 'json';
      xhr.open('get', '/');
      expect(xhr.response).toEqual(null);
    });

    it('should return json when the type is json and the request is done', done => {
      MockXMLHttpRequest.addHandler((req, res) => res.body('{"foo": "bar"}'));
      const xhr = new MockXMLHttpRequest();
      xhr.responseType = 'json';
      xhr.onload = () => {
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

    it('should return null when the type is other and the request is not done', () => {
      const fakeBuffer = {};
      MockXMLHttpRequest.addHandler((req, res) => res.body(fakeBuffer));
      const xhr = new MockXMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.open('get', '/');
      expect(xhr.response).toEqual(null);
    });

    it('should return an object when the type is other and the request is done', done => {
      const fakeBuffer = {};
      MockXMLHttpRequest.addHandler((req, res) => res.body(fakeBuffer));
      const xhr = new MockXMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = () => {
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

  describe('.setRequestHeader()', () => {
    it('should set a header', done => {
      expect.assertions(1);

      MockXMLHttpRequest.addHandler((req, res) => {
        expect(req.header('content-type')).toEqual('application/json');
        return res;
      });

      const xhr = new MockXMLHttpRequest();
      xhr.open('GET', '/');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = successOnEvent(done);
      xhr.onerror = failOnEvent(done);
      xhr.send();
    });
  });

  describe('.getResponseHeader()', () => {
    it('should have a response header', done => {
      expect.assertions(1);
      MockXMLHttpRequest.addHandler((req, res) => {
        return res.header('Content-Type', 'application/json');
      });

      const xhr = new MockXMLHttpRequest();
      xhr.open('get', '/');
      xhr.onloadend = () => {
        expect(xhr.getResponseHeader('Content-Type')).toEqual(
          'application/json'
        );
        done();
      };
      xhr.onerror = failOnEvent(done);
      xhr.send();
    });
  });

  describe('.getAllResponseHeaders()', () => {
    it('should have return headers as a string', done => {
      MockXMLHttpRequest.addHandler((req, res) => {
        return res
          .header('Content-Type', 'application/json')
          .header('X-Powered-By', 'SecretSauce');
      });

      const xhr = new MockXMLHttpRequest();
      xhr.open('get', '/');
      xhr.onload = () => {
        expect(xhr.getAllResponseHeaders()).toEqual(
          'content-type: application/json\r\nx-powered-by: SecretSauce\r\n'
        );
        done();
      };
      xhr.onerror = failOnEvent(done);
      xhr.send();
    });
  });

  describe('.constructor()', () => {
    it('should set .readyState to UNSENT', () => {
      const xhr = new MockXMLHttpRequest();
      expect(xhr.readyState).toEqual(MockXMLHttpRequest.UNSENT);
    });
  });

  describe('.open()', () => {
    it('should set .readyState to OPEN', () => {
      const xhr = new MockXMLHttpRequest();
      xhr.open('get', '/');
      expect(xhr.readyState).toEqual(MockXMLHttpRequest.OPENED);
    });

    it('should call .onreadystatechange', () => {
      const callback = jest.fn();
      const xhr = new MockXMLHttpRequest();
      xhr.onreadystatechange = callback;
      xhr.open('get', '/');
      expect(callback).toHaveBeenCalledTimes(1); //FIXME: check event
    });
  });

  describe('.send()', () => {
    it('should throw an error when .open() has not been called', () => {
      const xhr = new MockXMLHttpRequest();
      expect(() => xhr.send()).toThrow();
    });

    describe('async=false', () => {
      it('should dispatch events in order when both the request and response do not contain a body', () => {
        MockXMLHttpRequest.addHandler((req, res) => res);
        const events: string[] = [];
        const xhr = new MockXMLHttpRequest();
        xhr.open('get', '/', false);
        addListeners(xhr, events);
        xhr.send();
        expect(events).toEqual([
          'xhr:readystatechange', //DONE
          'xhr:load',
          'xhr:loadend'
        ]);
      });

      it('should dispatch events in order when request has a body', () => {
        MockXMLHttpRequest.addHandler((req, res) => res);
        const events: string[] = [];
        const xhr = new MockXMLHttpRequest();
        xhr.open('put', '/', false);
        addListeners(xhr, events);
        xhr.send('hello world!');
        expect(events).toEqual([
          'xhr:readystatechange', //DONE
          'xhr:load',
          'xhr:loadend'
        ]);
      });

      it('should dispatch events in order when response has a body', () => {
        MockXMLHttpRequest.addHandler((req, res) => res.body('Hello World!'));
        const events: string[] = [];
        const xhr = new MockXMLHttpRequest();
        xhr.open('put', '/', false);
        addListeners(xhr, events);
        xhr.send();
        expect(events).toEqual([
          'xhr:readystatechange', //DONE
          'xhr:load',
          'xhr:loadend'
        ]);
      });

      it('should call the error callback when there is an error', () => {
        expect.assertions(2);
        MockXMLHttpRequest.addHandler((req, res) => {
          throw new Error('test!');
        });
        MockXMLHttpRequest.errorCallback = ({req, err}) => {
          expect(req).toBeInstanceOf(MockRequest);
          expect(err).toBeInstanceOf(Error);
        };

        try {
          const xhr = new MockXMLHttpRequest();
          xhr.open('get', '/', false);
          xhr.send();
        } catch (error) {}
      });
    });
  });

  describe('async=true', () => {
    it('should dispatch events in order when both the request and response do not contain a body', done => {
      MockXMLHttpRequest.addHandler((req, res) => res);

      const events: string[] = [];
      const xhr = new MockXMLHttpRequest();
      xhr.open('get', '/');
      addListeners(xhr, events);
      xhr.onloadend = () => {
        expect(events).toEqual([
          'xhr:loadstart',
          'xhr:readystatechange', //HEADERS_RECEIVED
          'xhr:progress',
          'xhr:readystatechange', //DONE
          'xhr:load'
        ]);
        done();
      };
      xhr.send();
    });

    it('should dispatch events in order when request has a body', done => {
      MockXMLHttpRequest.addHandler((req, res) => res);

      const events: string[] = [];
      const xhr = new MockXMLHttpRequest();
      xhr.open('put', '/');
      addListeners(xhr, events);
      xhr.onloadend = () => {
        expect(events).toEqual([
          'xhr:loadstart',
          'upload:loadstart',
          'upload:progress',
          'upload:load',
          'upload:loadend',
          'xhr:readystatechange', //HEADERS_RECEIVED
          'xhr:progress',
          'xhr:readystatechange', //DONE
          'xhr:load'
        ]);
        done();
      };
      xhr.send('hello world!');
    });

    it('should dispatch events in order when response has a body', done => {
      MockXMLHttpRequest.addHandler((req, res) => res.body('Hello World!'));

      const events: string[] = [];
      const xhr = new MockXMLHttpRequest();
      xhr.open('put', '/');
      addListeners(xhr, events);
      xhr.onloadend = () => {
        expect(events).toEqual([
          'xhr:loadstart',
          'xhr:readystatechange', //HEADERS_RECEIVED
          'xhr:readystatechange', //LOADING
          'xhr:progress',
          'xhr:readystatechange', //DONE
          'xhr:load'
        ]);
        done();
      };
      xhr.send();
    });
  });

  describe('responseXML', () => {
    it('Should return null if status is not DONE', function() {
      const xhr = new MockXMLHttpRequest();
      xhr.responseType = '';
      xhr.open('get', '/');
      expect(xhr.readyState).not.toBe(4);
      expect(xhr.responseXML).toEqual(null);
    });

    it('Should return null if status is DONE and body type is not Document', function() {
      const xhr = new MockXMLHttpRequest();
      xhr.responseType = '';

      xhr.onload = () => {
        expect(xhr.readyState).toEqual(4);
        expect(xhr.responseXML).toBe(null);
      };
      xhr.open('get', '/');
      xhr.send();
    });

    it('Should return the document response if status is DONE and body type is Document', function(done) {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <root></root>`;

      const parser = new window.DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'application/xml');

      MockXMLHttpRequest.addHandler((req, res) => res.body(xmlDoc));

      const xhr = new MockXMLHttpRequest();
      xhr.responseType = '';

      xhr.onload = () => {
        try {
          expect(xhr.responseXML).toEqual(xmlDoc);
          done();
        } catch (error) {
          done.fail(error);
        }
      };
      xhr.open('get', '/');
      xhr.send();
    });
  });
  //TODO: check values of all events

  it('should set the request body when .send() is called with a body', done => {
    MockXMLHttpRequest.addHandler((req, res) => {
      expect(req.body()).toEqual('Hello World!');
      return res;
    });

    const xhr = new MockXMLHttpRequest();
    xhr.onload = successOnEvent(done);
    xhr.onerror = failOnEvent(done);
    xhr.open('post', '/');
    xhr.send('Hello World!');
  });

  it('should not set the request body when .send() is not called with a body', done => {
    MockXMLHttpRequest.addHandler((req, res) => {
      expect(req.body()).toEqual(null);
      return res;
    });

    const xhr = new MockXMLHttpRequest();
    xhr.onload = successOnEvent(done);
    xhr.onerror = failOnEvent(done);
    xhr.open('get', '/');
    xhr.send();
  });

  it('should time out when .timeout > 0 and no response is resloved within the time', done => {
    let start: number, end: number;

    MockXMLHttpRequest.addHandler((req, res) => new Promise(() => {}));

    const xhr = new MockXMLHttpRequest();
    xhr.timeout = 100;
    xhr.ontimeout = () => {
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

  it('should not time out when .timeout > 0 and the request was aborted', done => {
    MockXMLHttpRequest.addHandler((req, res) => new Promise(() => {}));
    const xhr = new MockXMLHttpRequest();
    xhr.timeout = 100;
    xhr.ontimeout = failOnEvent(done);
    xhr.onabort = successOnEvent(done);
    xhr.onerror = failOnEvent(done);
    xhr.open('get', '/');
    xhr.send();
    xhr.abort();
  });

  it('should not time out when .timeout > 0 and the request errored', done => {
    MockXMLHttpRequest.addHandler((req, res) =>
      Promise.reject(new Error('test!'))
    );
    const xhr = new MockXMLHttpRequest();
    xhr.timeout = 100;
    xhr.ontimeout = failOnEvent(done);
    xhr.onerror = successOnEvent(done);
    xhr.open('get', '/');
    xhr.send();
  });

  it('should set the request Content-Type header when the request Content-Type header has not been set and a body has been provided', done => {
    MockXMLHttpRequest.addHandler((req, res) => {
      expect(req.header('content-type')).toEqual('text/plain; charset=UTF-8');
      return res;
    });

    const xhr = new MockXMLHttpRequest();
    xhr.onload = successOnEvent(done);
    xhr.onerror = failOnEvent(done);
    xhr.open('post', '/');
    xhr.send('hello world!');
  });

  it('should not set the request Content-Type header when the request Content-Type header has been set and a body has been provided', done => {
    MockXMLHttpRequest.addHandler((req, res) => {
      expect(req.header('content-type')).toEqual('foo/bar');
      return res;
    });

    const xhr = new MockXMLHttpRequest();
    xhr.onload = successOnEvent(done);
    xhr.onerror = failOnEvent(done);
    xhr.open('post', '/');
    xhr.setRequestHeader('content-type', 'foo/bar');
    xhr.send('hello world!');
  });

  it('should call the error callback when there is an error', done => {
    expect.assertions(2);
    MockXMLHttpRequest.addHandler((req, res) =>
      Promise.reject(new Error('test!'))
    );
    MockXMLHttpRequest.errorCallback = ({req, err}) => {
      expect(req).toBeInstanceOf(MockRequest);
      expect(err).toBeInstanceOf(Error);
    };

    const xhr = new MockXMLHttpRequest();
    xhr.onload = failOnEvent(done);
    xhr.onerror = successOnEvent(done);
    xhr.open('get', '/');
    xhr.send();
  });

  it('should be able to send another request after the previous request errored', done => {
    MockXMLHttpRequest.addHandler((req, res) =>
      Promise.reject(new Error('test!'))
    );

    const xhr = new MockXMLHttpRequest();
    xhr.timeout = 100;
    xhr.ontimeout = failOnEvent(done);
    xhr.onerror = () => {
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

  it('should error when no handlers are registered', done => {
    expect.assertions(2);

    MockXMLHttpRequest.errorCallback = ({req, err}) => {
      expect(req).toBeInstanceOf(MockRequest);
      expect(err).toBeInstanceOf(MockError);
    };

    const xhr = new MockXMLHttpRequest();
    xhr.onload = failOnEvent(done);
    xhr.onerror = successOnEvent(done);
    xhr.open('get', '/');
    xhr.send();
  });
});
