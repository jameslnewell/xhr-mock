/*
 This file contains the source from the "How to?" section of README.md
 */

import mock, {proxy} from '../src';

describe('how to', () => {
  beforeEach(() => mock.setup());

  afterEach(() => mock.teardown());

  it('should report upload progress', async () => {
    mock.post('/', {});

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = event =>
      console.log('upload progress:', event.loaded, '/', event.total);
    xhr.open('POST', '/');
    xhr.setRequestHeader('Content-Length', '12');
    xhr.send('Hello World!');
  });

  it('should report download progress', async () => {
    mock.get('/', {
      headers: {'Content-Length': '12'},
      body: 'Hello World!'
    });

    const xhr = new XMLHttpRequest();
    xhr.onprogress = event =>
      console.log('download progress:', event.loaded, '/', event.total);
    xhr.open('GET', '/');
    xhr.send();
  });

  it('should simulate a timeout', async () => {
    mock.get('/', () => new Promise(() => {}));

    const xhr = new XMLHttpRequest();
    xhr.timeout = 100;
    xhr.ontimeout = event => console.log('timed out');
    xhr.open('GET', '/');
    xhr.send();
  });

  it('should simulate an error', async () => {
    mock.error(() => {
      /* do nothing */
    });
    mock.get('/', () => Promise.reject(new Error('😵')));

    const xhr = new XMLHttpRequest();
    xhr.onerror = event => console.log('error');
    xhr.open('GET', '/');
    xhr.send();
  });

  it('should proxy requests', async () => {
    // mock specific requests
    mock.post('/', {status: 204});

    // proxy unhandled requests to the real servers
    mock.use(proxy);

    // this request will be mocked
    const xhr1 = new XMLHttpRequest();
    xhr1.open('POST', '/');
    xhr1.send();

    // this request will be proxied to the real server
    const xhr2 = new XMLHttpRequest();
    xhr2.open('GET', 'https://jsonplaceholder.typicode.com/users/1');
    xhr2.send();
  });
});
