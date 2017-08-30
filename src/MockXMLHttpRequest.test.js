import MockXMLHttpRequest, {STATE} from './MockXMLHttpRequest';

const handleErr = done => event => done.fail(event.error);

const doneIfError = (done, check) => (...args) => {
  debugger;
  try {
    check(...args);
  } catch (error) {
    done.fail(error);
  }
};

describe('MockXMLHttpRequest', () => {
  beforeEach(() => {
    MockXMLHttpRequest.removeAllHandlers();
  });

  describe('.setRequestHeader()', () => {
    it('should set a header', done => {
      MockXMLHttpRequest.addHandler((req, res) => {
        expect(req.header('content-type')).toEqual('application/json');
        return res;
      });

      const xhr = new MockXMLHttpRequest();
      xhr.open('/');
      xhr.setRequestHeader('content-type', 'application/json');
      xhr.onload = done;
      xhr.send();
    });
  });

  describe('.open()', () => {
    it('should be OPEN', () => {
      const xhr = new MockXMLHttpRequest();
      xhr.open('get', '/');
      expect(xhr.readyState).toEqual(MockXMLHttpRequest.OPENED);
    });
  });

  describe('.send()', () => {
    it('should set the request body when X', done => {
      MockXMLHttpRequest.addHandler((req, res) => {
        expect(req.body()).toEqual('Hello World!');
        return res;
      });

      const xhr = new MockXMLHttpRequest();
      xhr.onload = done;
      xhr.onerror = handleErr(done);
      xhr.open('post', '/');
      xhr.send('Hello World!');
    });

    it('should not set the request body', done => {
      MockXMLHttpRequest.addHandler((req, res) => {
        expect(req.body()).toEqual(null);
        return res;
      });

      const xhr = new MockXMLHttpRequest();
      xhr.onload = done;
      xhr.onerror = handleErr(done);
      xhr.open('get', '/');
      xhr.send();
    });

    it('should time out after 100ms', done => {
      let start, end;

      MockXMLHttpRequest.addHandler((req, res) => new Promise(() => {}));

      const xhr = new MockXMLHttpRequest();
      xhr.timeout = 100;
      xhr.ontimeout = () => {
        end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(100);
        expect(xhr.readyState).toEqual(4);
        done();
      };
      xhr.onerror = handleErr(done);
      start = Date.now();
      xhr.open('get', '/');
      xhr.send();
    });

    it('should not time out when the request was aborted', done => {
      debugger;
      MockXMLHttpRequest.addHandler((req, res) => new Promise(() => {}));
      const xhr = new MockXMLHttpRequest();
      xhr.timeout = 100;
      xhr.ontimeout = done.fail;
      xhr.onabort = done;
      xhr.onerror = handleErr(done);
      xhr.open('get', '/');
      xhr.send();
      xhr.abort();
    });

    it('should not time out when the request errored', done => {
      MockXMLHttpRequest.addHandler((req, res) =>
        Promise.reject(new Error('test!'))
      );
      const xhr = new MockXMLHttpRequest();
      xhr.timeout = 100;
      xhr.ontimeout = done.fail;
      xhr.onerror = done;
      xhr.open('get', '/');
      xhr.send();
      xhr.abort();
    });
  });

  describe('.getResponseHeader()', () => {
    it('should have a response header', done => {
      MockXMLHttpRequest.addHandler((req, res) => {
        return res.header('Content-Type', 'application/json');
      });

      const xhr = new MockXMLHttpRequest();
      xhr.open('/');
      xhr.onload = () => {
        expect(xhr.getResponseHeader('Content-Type')).toEqual(
          'application/json'
        );
        done();
      };
      xhr.onerror = handleErr(done);
      xhr.send();
    });
  });

  describe('.getAllResponseHeaders()', () => {
    it('should have a response header', done => {
      MockXMLHttpRequest.addHandler((req, res) => {
        return res
          .header('Content-Type', 'application/json')
          .header('X-Powered-By', 'SecretSauce');
      });

      const xhr = new MockXMLHttpRequest();
      xhr.open('/');
      xhr.onload = () => {
        expect(xhr.getAllResponseHeaders()).toEqual(
          'content-type: application/json\r\nx-powered-by: SecretSauce\r\n'
        );
        done();
      };
      xhr.onerror = handleErr(done);
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
      const xhr = new MockXMLHttpRequest();
      xhr.onreadystatechange = jest.fn();
      xhr.open('get', '/');
      expect(xhr.onreadystatechange.mock.calls).toHaveLength(1); //FIXME: check event
    });

    it('should throw an error when called with async=false', () => {
      const xhr = new MockXMLHttpRequest();
      expect(() => xhr.open('get', '/', false)).toThrow();
    });
  });

  describe('.send()', () => {
    it('should throw an error when .open() has not been called', () => {
      const xhr = new MockXMLHttpRequest();
      expect(() => xhr.send()).toThrow();
    });

    const addListeners = (xhr, events) => {
      const pushEvent = event => events.push(`xhr:${event.type}`);
      xhr.addEventListener('readystatechange', pushEvent);
      xhr.addEventListener('loadstart', pushEvent);
      xhr.addEventListener('progress', pushEvent);
      xhr.addEventListener('load', pushEvent);
      xhr.addEventListener('loadend', pushEvent);

      const uploadPushEvent = event => events.push(`upload:${event.type}`);
      xhr.upload.addEventListener('loadstart', uploadPushEvent);
      xhr.upload.addEventListener('progress', uploadPushEvent);
      xhr.upload.addEventListener('load', uploadPushEvent);
      xhr.upload.addEventListener('loadend', uploadPushEvent);
    };

    it('should dispatch events in order when request does not have a body', done => {
      MockXMLHttpRequest.addHandler((req, res) => res);

      const events = [];
      const xhr = new MockXMLHttpRequest();
      xhr.open('get', '/');
      addListeners(xhr, events);
      xhr.onloadend = () => {
        expect(events).toEqual([
          'xhr:loadstart',
          'xhr:readystatechange', //HEADERS_RECEIVED
          'xhr:readystatechange', //LOADING
          'xhr:progress',
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

      const events = [];
      const xhr = new MockXMLHttpRequest();
      xhr.open('put', '/');
      addListeners(xhr, events);
      xhr.onloadend = () => {
        expect(events).toEqual([
          'xhr:loadstart',
          'upload:loadstart',
          'upload:progress',
          'upload:progress',
          'upload:load',
          'upload:loadend',
          'xhr:readystatechange', //HEADERS_RECEIVED
          'xhr:readystatechange', //LOADING
          'xhr:progress',
          'xhr:progress',
          'xhr:readystatechange', //DONE
          'xhr:load'
        ]);
        done();
      };
      xhr.send('hello world!');
    });

    //TODO: check values of all events
  });
});
