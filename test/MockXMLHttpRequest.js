var assert              = require('assert');
var MockXMLHttpRequest  = require('../lib/MockXMLHttpRequest');

describe('MockXMLHttpRequest', function() {

  beforeEach(function() {
    MockXMLHttpRequest.handlers = [];
  });

  afterEach(function() {
    MockXMLHttpRequest.handlers = [];
  });

  describe('.setRequestHeader()', function() {

    it('should set a header', function(done) {

      MockXMLHttpRequest.addHandler(function(req, res) {
        assert.equal(req.header('content-type'), 'application/json');
        done();
      });

      var xhr = new MockXMLHttpRequest();
      xhr.open('/');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();

    });

  });

  describe('.send()', function() {

    it('should time out after 100ms', function (done) {

      MockXMLHttpRequest.addHandler(function (req, res) {
        return res.timeout(true);
      });

      var xhr = new MockXMLHttpRequest();
      xhr.timeout = 100;
      xhr.open('/');
      xhr.ontimeout = function () {
        assert(xhr.readyState === 4);
        done();
      };
      xhr.send();

    });

  });

  describe('.getResponseHeader()', function() {

    it('should have a response header', function (done) {

      MockXMLHttpRequest.addHandler(function (req, res) {
        return res.header('Content-Type', 'application/json');
      });

      var xhr = new MockXMLHttpRequest();
      xhr.open('/');
      xhr.onload = function () {
        assert.equal(xhr.getResponseHeader('Content-Type'), 'application/json');
        done();
      };
      xhr.send();

    });

  });

  describe('.getAllResponseHeaders()', function() {

    it('should have a response header', function(done) {

      MockXMLHttpRequest.addHandler(function(req, res) {
        return res
          .header('Content-Type', 'application/json')
          .header('X-Powered-By', 'SecretSauce')
        ;
      });

      var xhr = new MockXMLHttpRequest();
      xhr.open('/');
      xhr.onload = function() {
        assert.equal(xhr.getAllResponseHeaders(), 'content-type: application/json, x-powered-by: SecretSauce');
        done();
      };
      xhr.send();

    });

  });

});
