import mock, {MockResponse} from '../src';
import {
  recordXHREventsAsync,
  recordXHREventsSync
} from './util/recordXHREvents';

// the expected output of these tests is recorded using:
//   => https://codepen.io/jameslnewell/pen/RxQqzV?editors=0010
describe('xhr-mock', () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());

  describe('async=false', () => {
    it('when the request downloads some data', () => {
      mock.get('/', {
        status: 200,
        headers: {
          'Content-Length': '12'
        },
        body: 'Hello World!'
      });

      const xhr = new XMLHttpRequest();
      const events = recordXHREventsSync(xhr);
      xhr.open('GET', '/', false);
      xhr.send();

      expect(events).toEqual([
        ['readystatechange', 1],
        ['readystatechange', 4],
        [
          'load',
          {
            lengthComputable: true,
            loaded: 12,
            total: 12
          }
        ],
        [
          'loadend',
          {
            lengthComputable: true,
            loaded: 12,
            total: 12
          }
        ]
      ]);
    });

    it('when the request errored', () => {
      expect.assertions(1);

      mock.get('/', () => {
        throw new Error();
      });

      const xhr = new XMLHttpRequest();
      const events = recordXHREventsSync(xhr);
      xhr.open('GET', '/', false);

      try {
        xhr.send();
      } catch (err) {
        expect(events).toEqual([['readystatechange', 1]]);
      }
    });
  });

  describe('async=true', () => {
    it('when the request downloads data', () => {
      mock.get('/', {
        status: 200,
        headers: {
          'Content-Length': '12'
        },
        body: 'Hello World!'
      });

      const xhr = new XMLHttpRequest();
      const events = recordXHREventsAsync(xhr);

      xhr.open('GET', '/');
      xhr.send();

      return expect(events).resolves.toEqual([
        ['readystatechange', 1],
        [
          'loadstart',
          {
            lengthComputable: false,
            loaded: 0,
            total: 0
          }
        ],
        ['readystatechange', 2],
        ['readystatechange', 3],
        [
          'progress',
          {
            lengthComputable: true,
            loaded: 12,
            total: 12
          }
        ],
        ['readystatechange', 4],
        [
          'load',
          {
            lengthComputable: true,
            loaded: 12,
            total: 12
          }
        ],
        [
          'loadend',
          {
            lengthComputable: true,
            loaded: 12,
            total: 12
          }
        ]
      ]);
    });

    it('when the request uploads data', () => {
      mock.post('/', {
        status: 200,
        headers: {
          'Content-Length': '12'
        },
        body: 'Hello World!'
      });

      const xhr = new XMLHttpRequest();
      const events = recordXHREventsAsync(xhr);
      xhr.open('POST', '/');
      xhr.setRequestHeader('Content-Length', '6');
      xhr.send('foobar');

      return expect(events).resolves.toEqual([
        ['readystatechange', 1],
        [
          'loadstart',
          {
            lengthComputable: false,
            loaded: 0,
            total: 0
          }
        ],
        [
          'upload:loadstart',
          {
            lengthComputable: true,
            loaded: 0,
            total: 6
          }
        ],
        [
          'upload:progress',
          {
            lengthComputable: true,
            loaded: 6,
            total: 6
          }
        ],
        [
          'upload:load',
          {
            lengthComputable: true,
            loaded: 6,
            total: 6
          }
        ],
        [
          'upload:loadend',
          {
            lengthComputable: true,
            loaded: 6,
            total: 6
          }
        ],
        ['readystatechange', 2],
        ['readystatechange', 3],
        [
          'progress',
          {
            lengthComputable: true,
            loaded: 12,
            total: 12
          }
        ],
        ['readystatechange', 4],
        [
          'load',
          {
            lengthComputable: true,
            loaded: 12,
            total: 12
          }
        ],
        [
          'loadend',
          {
            lengthComputable: true,
            loaded: 12,
            total: 12
          }
        ]
      ]);
    });

    it('when the request timed out', () => {
      mock.get('/', () => new Promise(() => {}));

      const xhr = new XMLHttpRequest();
      const events = recordXHREventsAsync(xhr);
      xhr.timeout = 1;
      xhr.open('GET', '/');
      xhr.send();

      return expect(events).resolves.toEqual([
        ['readystatechange', 1],
        [
          'loadstart',
          {
            lengthComputable: false,
            loaded: 0,
            total: 0
          }
        ],
        ['readystatechange', 4],
        'timeout',
        [
          'loadend',
          {
            lengthComputable: false,
            loaded: 0,
            total: 0
          }
        ]
      ]);
    });

    it('when the request aborted', () => {
      mock.get('/', () => new Promise(() => {}));

      const xhr = new XMLHttpRequest();
      const events = recordXHREventsAsync(xhr);
      xhr.open('GET', '/');
      xhr.send();
      xhr.abort();

      return expect(events).resolves.toEqual([
        ['readystatechange', 1],
        [
          'loadstart',
          {
            lengthComputable: false,
            loaded: 0,
            total: 0
          }
        ],
        ['readystatechange', 4],
        'abort',
        [
          'loadend',
          {
            lengthComputable: false,
            loaded: 0,
            total: 0
          }
        ]
      ]);
    });

    it('when the request errored', () => {
      mock.get('/', () => Promise.reject(new Error('😵')));

      const xhr = new XMLHttpRequest();
      const events = recordXHREventsAsync(xhr);
      xhr.open('GET', '/');
      xhr.send();

      return expect(events).resolves.toEqual([
        ['readystatechange', 1],
        [
          'loadstart',
          {
            lengthComputable: false,
            loaded: 0,
            total: 0
          }
        ],
        ['readystatechange', 4],
        'error',
        [
          'loadend',
          {
            lengthComputable: false,
            loaded: 0,
            total: 0
          }
        ]
      ]);
    });
  });
});
