'use strict';
exports.__esModule = true;
var chai_1 = require('chai');
var xhr_mock_1 = require('xhr-mock');
describe('native', function() {
  beforeEach(function() {
    return xhr_mock_1['default'].setup();
  });
  afterEach(function() {
    return xhr_mock_1['default'].teardown();
  });
  it('should receive a request containing a blob', function(done) {
    xhr_mock_1['default'].post('/files', function(req, res) {
      chai_1.expect(req.header('content-type')).to.equal('image/png');
      chai_1.expect(req.body()).to.equal(data);
      return res;
    });
    var data = new Blob(['<h1>Hello World!</h1>'], {type: 'image/png'});
    var req = new XMLHttpRequest();
    req.open('POST', '/files');
    req.onload = function() {
      done();
    };
    req.send(data);
  });
  it('should receive a request containing form data', function(done) {
    xhr_mock_1['default'].post('/contact', function(req, res) {
      chai_1.expect(req.header('content-type')).to.equal('multipart/form-data; boundary=----XHRMockFormBoundary');
      chai_1.expect(req.body()).to.equal(data);
      return res;
    });
    var data = new FormData();
    data.append('name', 'John Smith');
    data.append('email', 'john@smith.com');
    data.append('message', 'blah\nblah\nblah');
    var req = new XMLHttpRequest();
    req.open('POST', '/contact');
    req.onload = function() {
      done();
    };
    req.send(data);
  });
  it('should receive a request containing url data', function(done) {
    xhr_mock_1['default'].post('/contact', function(req, res) {
      chai_1.expect(req.header('content-type')).to.equal('application/x-www-form-urlencoded; charset=UTF-8');
      chai_1.expect(req.body()).to.equal(data);
      return res;
    });
    var data = new URLSearchParams();
    data.append('name', 'John Smith');
    data.append('email', 'john@smith.com');
    data.append('message', 'blah\nblah\nblah');
    var req = new XMLHttpRequest();
    req.open('POST', '/contact');
    req.onload = function() {
      done();
    };
    req.send(data);
  });
  it('should receive a request containing string data', function(done) {
    xhr_mock_1['default'].post('/echo', function(req, res) {
      chai_1.expect(req.header('content-type')).to.equal('text/plain; charset=UTF-8');
      chai_1.expect(req.body()).to.equal('Hello World!');
      return res;
    });
    var data = 'Hello World!';
    var req = new XMLHttpRequest();
    req.open('POST', '/echo');
    req.onload = function() {
      done();
    };
    req.send(data);
  });
  it('should send a response containing an array buffer', function(done) {
    xhr_mock_1['default'].get('/myfile.png', {
      body: new ArrayBuffer(0)
    });
    // sourced from https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
    var req = new XMLHttpRequest();
    req.open('GET', '/myfile.png');
    req.responseType = 'arraybuffer';
    req.onload = function() {
      var arrayBuffer = req.response;
      chai_1.expect(arrayBuffer).to.be.an('ArrayBuffer');
      done();
    };
    req.send(null);
  });
});
