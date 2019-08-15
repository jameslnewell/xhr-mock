import {expect} from 'chai';
import axios from 'axios';
import mock from 'xhr-mock';

describe('axios', () => {
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

    const res = await axios.get('/');

    expect(res.status).to.eq(200);
    expect(res.statusText).to.eq('OK');
    expect(res.headers).to.deep.eq({
      'content-length': '12',
    });
    expect(res.data).to.eq('Hello World!');
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

    const res = await axios.post('/', {foo: 'bar'});

    expect(res.status).to.eq(201);
    expect(res.statusText).to.eq('Created');
    expect(res.headers).to.deep.eq({
      'content-length': '12',
    });
    expect(res.data).to.eq('Hello World!');
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

    const res = await axios.put('/', {foo: 'bar'});

    expect(res.status).to.eq(200);
    expect(res.statusText).to.eq('Created');
    expect(res.headers).to.deep.eq({
      'content-length': '12',
    });
    expect(res.data).to.eq('Hello World!');
  });

  it('should DELETE', async () => {
    mock.use((req, res) => {
      expect(req.method()).to.eq('DELETE');
      expect(String(req.url())).to.eq('/');
      expect(req.body()).to.eq(null);
      return res.status(204).reason('No Content');
    });

    const res = await axios.delete('/');

    expect(res.status).to.eq(204);
    expect(res.statusText).to.eq('No Content');
    expect(res.headers).to.deep.eq({});
    expect(res.data).to.eq('');
  });

  it('should time out', async () => {
    mock.get('/', () => new Promise(() => {}));

    try {
      await axios.get('/', {timeout: 10});
      expect.fail();
    } catch (error) {
      expect(error).to.be.an('Error');
      expect(error.message.toLowerCase()).to.contain('timeout');
    }
  });

  it('should error', async () => {
    mock.get('/', () => Promise.reject(new Error('😬')));

    try {
      await axios.get('/');
      expect.fail();
    } catch (error) {
      expect(error).to.be.an('Error');
      expect(error.message).to.contain('Network Error');
    }
  });
});
