import {expect} from 'chai';
import mock from 'xhr-mock';

describe('native', () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());

  it('should receive a request containing a blob', done => {
    mock.post('/files', (req, res) => {
      expect(req.header('content-type')).to.equal('image/png');
      expect(req.body()).to.equal(data);
      return res;
    });

    const data = new Blob(['<h1>Hello World!</h1>'], {type: 'image/png'});

    const req = new XMLHttpRequest();
    req.open('POST', '/files');
    req.onload = () => {
      done();
    };
    req.send(data);
  });

  it('should receive a request containing form data', done => {
    mock.post('/contact', (req, res) => {
      expect(req.header('content-type')).to.equal(
        'multipart/form-data; boundary=----XHRMockFormBoundary',
      );
      expect(req.body()).to.equal(data);
      return res;
    });

    const data = new FormData();
    data.append('name', 'John Smith');
    data.append('email', 'john@smith.com');
    data.append('message', 'blah\nblah\nblah');

    const req = new XMLHttpRequest();
    req.open('POST', '/contact');
    req.onload = () => {
      done();
    };
    req.send(data);
  });

  it('should receive a request containing url data', done => {
    mock.post('/contact', (req, res) => {
      expect(req.header('content-type')).to.equal(
        'application/x-www-form-urlencoded; charset=UTF-8',
      );
      expect(req.body()).to.equal(data);
      return res;
    });

    const data = new URLSearchParams();
    data.append('name', 'John Smith');
    data.append('email', 'john@smith.com');
    data.append('message', 'blah\nblah\nblah');

    const req = new XMLHttpRequest();
    req.open('POST', '/contact');
    req.onload = () => {
      done();
    };
    req.send(data);
  });

  it('should receive a request containing string data', done => {
    mock.post('/echo', (req, res) => {
      expect(req.header('content-type')).to.equal('text/plain; charset=UTF-8');
      expect(req.body()).to.equal('Hello World!');
      return res;
    });

    const data = 'Hello World!';

    const req = new XMLHttpRequest();
    req.open('POST', '/echo');
    req.onload = () => {
      done();
    };
    req.send(data);
  });

  it('should send a response containing an array buffer', done => {
    mock.get('/myfile.png', {
      body: new ArrayBuffer(0),
    });

    // sourced from https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
    const req = new XMLHttpRequest();
    req.open('GET', '/myfile.png');
    req.responseType = 'arraybuffer';
    req.onload = () => {
      const arrayBuffer = req.response;
      expect(arrayBuffer).to.be.an('ArrayBuffer');
      done();
    };
    req.send(null);
  });
});
