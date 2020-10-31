import {expect} from 'chai';
window.fetch = null as any;
import mock from 'xhr-mock';
import 'whatwg-fetch';

describe('whatwg-fetch', () => {
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

    const res = await fetch('/');

    expect(res.status).to.eq(200);
    expect(res.statusText).to.eq('OK');
    expect(res.headers.get('content-length')).to.eq('12');
    const data = await res.text();
    expect(data).to.eq('Hello World!');
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

    const res = await fetch('/', {
      method: 'POST',
      body: JSON.stringify({foo: 'bar'})
    });

    expect(res.status).to.eq(201);
    expect(res.statusText).to.eq('Created');
    expect(res.headers.get('content-length')).to.eq('12');
    const data = await res.text();
    expect(data).to.eq('Hello World!');
  });

  it('should PUT', async () => {
    mock.use((req, res) => {
      expect(req.method()).to.eq('PUT');
      expect(String(req.url())).to.eq('/');
      expect(req.body()).to.eq(JSON.stringify({foo: 'bar'}));
      return res
        .status(200)
        .reason('Created')
        .header('Content-Length', '12')
        .body('Hello World!');
    });

    const res = await fetch('/', {
      method: 'PUT',
      body: JSON.stringify({foo: 'bar'})
    });

    expect(res.status).to.eq(200);
    expect(res.statusText).to.eq('Created');
    expect(res.headers.get('content-length')).to.eq('12');
    const data = await res.text();
    expect(data).to.eq('Hello World!');
  });

  it('should DELETE', async () => {
    mock.use((req, res) => {
      expect(req.method()).to.eq('DELETE');
      expect(String(req.url())).to.eq('/');
      expect(req.body()).to.eq(null);
      return res.status(204).reason('No Content');
    });

    const res = await fetch('/', {method: 'DELETE'});

    expect(res.status).to.eq(204);
    expect(res.statusText).to.eq('No Content');
    expect(res.headers.has('content-length')).to.be.false;
    const data = await res.text();
    expect(data).to.eq('');
  });

  it('should abort', async () => {
    mock.get('/', () => new Promise(() => {}));

    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10);

    try {
      await fetch('/', {signal: controller.signal});
      expect.fail();
    } catch (error) {
      expect(error.message.toLowerCase()).to.contain('aborted');
    }
  });

  it('should error', async () => {
    mock.get('/', () => Promise.reject(new Error('😬')));

    try {
      await fetch('/');
      expect.fail();
    } catch (error) {
      expect(error).to.be.an('Error');
      expect(error.message).to.contain('Network request failed');
    }
  });
});
