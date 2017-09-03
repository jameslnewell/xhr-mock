import mock from '../src';

const request = (method: string, url: string) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        return resolve(xhr.responseText);
      }
    };
    xhr.onerror = event => reject(event.error);
    xhr.open(method, url);
    xhr.send();
  });

describe('native', () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());

  it('should send a POST request', () => {
    mock.mock((req, res) => {
      expect(req.method()).toEqual('POST');
      expect(req.url().toString()).toEqual('/example');
      return res;
    });

    return request('POST', '/example');
  });

  it('should timeout when the timeout is greater than 0', done => {
    mock.post('http://localhost/foo/bar', (req, res) => {
      return new Promise(() => {});
    });

    const xhr = new XMLHttpRequest();
    xhr.timeout = 100;
    xhr.ontimeout = done;
    xhr.onerror = done.fail;
    xhr.open('post', 'http://localhost/foo/bar');
    xhr.send();
  });

  it('should error when the promise is rejected', done => {
    mock.post('http://localhost/foo/bar', (req, res) => {
      return Promise.reject(new Error('Uh oh'));
    });

    const xhr = new XMLHttpRequest();
    xhr.onerror = done;
    xhr.open('post', 'http://localhost/foo/bar');
    xhr.send();
  });

  it('should emit progress events when uploading', done => {
    expect.assertions(1);

    mock.post('http://localhost/foo/bar', (req, res) => {
      req
        .progress(true, 100, 0)
        .progress(true, 100, 50)
        .progress(true, 100, 100);
      return res
        .status(201)
        .header('Content-Type', 'image/jpeg')
        .body('');
    });

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = jest.fn();
    xhr.onerror = done.fail;
    xhr.onload = () => {
      expect(xhr.upload.onprogress).toHaveBeenCalledTimes(3);
      done();
    };
    xhr.open('post', 'http://localhost/foo/bar');
    xhr.send();
  });
});
