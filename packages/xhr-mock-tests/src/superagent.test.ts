import {expect} from 'chai';
import * as superagent from 'superagent';
import mock from 'xhr-mock';

describe('superagent', () => {
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

    const res = await superagent.get('/');

    expect(res.status).to.eq(200);
    // expect(res.statusText).to.eq('OK');
    expect(res.header).to.have.property('content-length', '12');
    expect(res.text).to.eq('Hello World!');
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

    const res = await superagent.post('/').send({foo: 'bar'});

    expect(res.status).to.eq(201);
    // expect(res.statusText).to.eq('Created');
    expect(res.header).to.have.property('content-length', '12');
    expect(res.text).to.eq('Hello World!');
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

    const res = await superagent.put('/').send({foo: 'bar'});

    expect(res.status).to.eq(200);
    // expect(res.statusText).to.eq('Created');
    expect(res.header).to.have.property('content-length', '12');
    expect(res.text).to.eq('Hello World!');
  });

  it('should DELETE', async () => {
    mock.use((req, res) => {
      expect(req.method()).to.eq('DELETE');
      expect(String(req.url())).to.eq('/');
      expect(req.body()).to.eq(null);
      return res.status(204).reason('No Content');
    });

    const res = await superagent.delete('/');

    expect(res.status).to.eq(204);
    // expect(res.statusText).to.eq('No Content');
    expect(res.header).not.to.have.property('content-length', '12');
    expect(res.text).to.eq('');
  });

  it('should time out', async () => {
    mock.get('/', () => new Promise(() => {}));

    try {
      const res = await superagent.get('/').timeout({
        response: 5,
        deadline: 6
      });
      expect.fail();
    } catch (error) {
      expect(error).to.be.an('Error');
      expect(error.message).to.contain('timeout');
    }
  });

  it('should error', async () => {
    mock.get('/', () => Promise.reject(new Error('😬')));

    try {
      const res = await superagent.get('/');
      expect.fail();
    } catch (error) {
      expect(error).to.be.an('Error');
      expect(error.message).to.contain('terminated');
    }
  });
});
