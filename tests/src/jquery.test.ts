import {expect} from 'chai';
import * as $ from 'jquery';
import mock from 'xhr-mock';

describe('jquery', () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());

  it('should GET', async () => {
    mock.use((req, res) => {
      expect(req.method()).to.eq('GET');
      expect(String(req.url())).to.eq('/');
      expect(req.body()).to.eq(null);
      return res
        .status(200)
        .reason('OK')
        .header('Content-Length', '12')
        .body('Hello World!');
    });

    await $.ajax('/')
      .then((data, status, xhr) => {
        expect(xhr.status).to.eq(200);
        expect(xhr.statusText).to.eq('OK');
        expect(xhr.getAllResponseHeaders()).to.contain('content-length: 12\r\n');
        expect(data).to.eq('Hello World!');
      })
      .catch((xhr, status, error) => expect.fail(error));
  });

  it('should POST', async () => {
    mock.use((req, res) => {
      expect(req.method()).to.eq('POST');
      expect(String(req.url())).to.eq('/');
      expect(req.body()).to.eq(JSON.stringify({foo: 'bar'}));
      return res
        .status(201)
        .reason('Created')
        .header('Content-Length', '12')
        .body('Hello World!');
    });

    const res = await $.ajax({
      method: 'post',
      url: '/',
      data: JSON.stringify({foo: 'bar'})
    })
      .then((data, status, xhr) => {
        expect(xhr.status).to.eq(201);
        expect(xhr.statusText).to.eq('Created');
        expect(xhr.getAllResponseHeaders()).to.contain('content-length: 12\r\n');
        expect(data).to.eq('Hello World!');
      })
      .catch((xhr, status, error) => expect.fail(error));
  });

  it('should PUT', async () => {
    mock.use((req, res) => {
      expect(req.method()).to.eq('PUT');
      expect(String(req.url())).to.eq('/');
      expect(req.body()).to.eq(JSON.stringify({foo: 'bar'}));
      return res
        .status(200)
        .reason('OK')
        .header('Content-Length', '12')
        .body('Hello World!');
    });

    const res = await $.ajax({
      method: 'put',
      url: '/',
      data: JSON.stringify({foo: 'bar'})
    })
      .then((data, status, xhr) => {
        expect(xhr.status).to.eq(200);
        expect(xhr.statusText).to.eq('OK');
        expect(xhr.getAllResponseHeaders()).to.contain('content-length: 12\r\n');
        expect(data).to.eq('Hello World!');
      })
      .catch((xhr, status, error) => expect.fail(error));
  });

  it('should DELETE', async () => {
    mock.use((req, res) => {
      expect(req.method()).to.eq('DELETE');
      expect(String(req.url())).to.eq('/');
      expect(req.body()).to.eq(null);
      return res.status(204).reason('No Content');
    });

    const res = await $.ajax({
      method: 'delete',
      url: '/'
    })
      .then((data, status, xhr) => {
        expect(xhr.status).to.eq(204);
        expect(xhr.statusText).to.eq('No Content');
        expect(xhr.getAllResponseHeaders()).to.eq('');
        expect(data).to.eq(undefined);
      })
      .catch((xhr, status, error) => expect.fail(error));
  });

  it('should time out', async () => {
    mock.get('/', () => new Promise(() => {}));

    await $.ajax({
      url: '/',
      timeout: 10
    }).then(
      () => expect.fail(),
      (xhr, status, error) => {
        expect(status).to.eq('timeout');
        expect(error).to.contain('');
      }
    );
  });

  it('should error', async () => {
    mock.get('/', () => Promise.reject(new Error('😬')));

    await $.ajax('/').then(
      () => expect.fail(),
      (xhr, status, error) => {
        expect(status).to.eq('error');
        expect(error).to.contain('');
      }
    );
  });
});
