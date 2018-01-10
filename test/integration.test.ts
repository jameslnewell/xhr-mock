import mock, {proxy} from '../src';

const request = (method: string, url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        resolve(xhr.responseText);
      }
    };
    xhr.onerror = event => reject(event.error);
    xhr.open(method, url);
    xhr.send();
  });

describe('integration', () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());

  it('should send a POST request', () => {
    mock.use((req, res) => {
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
    xhr.ontimeout = () => done();
    xhr.onerror = () => done.fail();
    xhr.open('POST', 'http://localhost/foo/bar');
    xhr.send();
  });

  it('should error when the promise is rejected', done => {
    mock.post('http://localhost/foo/bar', (req, res) => {
      return Promise.reject(new Error('Uh oh'));
    });

    const xhr = new XMLHttpRequest();
    xhr.onerror = () => done();
    xhr.open('post', 'http://localhost/foo/bar');
    xhr.send();
  });

  it('should emit progress events when uploading', done => {
    expect.assertions(1);
    mock.post('http://localhost/foo/bar', (req, res) => {
      return res
        .status(201)
        .header('Content-Type', 'image/jpeg')
        .body('');
    });

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = jest.fn();
    xhr.onerror = () => done.fail();
    xhr.onloadend = () => {
      expect(xhr.upload.onprogress).toHaveBeenCalledTimes(1);
      done();
    };
    xhr.open('POST', 'http://localhost/foo/bar');
    xhr.send('Hello World!');
  });

  it('should emit progress events when downloading', done => {
    expect.assertions(1);
    mock.post('http://localhost/foo/bar', (req, res) => {
      return res
        .status(201)
        .header('Content-Type', 'image/jpeg')
        .body('Hello World!');
    });

    const xhr = new XMLHttpRequest();
    xhr.onprogress = jest.fn();
    xhr.onerror = () => done.fail();
    xhr.onloadend = () => {
      expect(xhr.onprogress).toHaveBeenCalledTimes(1);
      done();
    };
    xhr.open('POST', 'http://localhost/foo/bar');
    xhr.send();
  });

  //TODO: test content-length

  it('should proxy unhandled URLs', async () => {
    jest.setTimeout(20000);

    mock.get('https://reqres.in/api/users/1', {
      status: 200,
      body: 'Hello World!'
    });

    mock.use(proxy);

    const ret1 = await request('GET', 'https://reqres.in/api/users/1');
    expect(ret1).toEqual('Hello World!');

    const ret2 = await request('GET', 'https://reqres.in/api/users/2');
    expect(JSON.parse(ret2)).toEqual({
      data: expect.objectContaining({
        id: 2,
        first_name: 'Janet'
      })
    });
  });
});
