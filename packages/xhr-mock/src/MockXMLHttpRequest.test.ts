import MockEvent from './MockEvent';
import MockProgressEvent from './MockProgressEvent';
import MockXMLHttpRequest from './MockXMLHttpRequest';

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
});
