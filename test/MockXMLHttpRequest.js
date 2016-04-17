require('lie/polyfill');
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

  describe('.open()', function() {

    it('should be OPENED', function() {

      var xhr = new MockXMLHttpRequest();
      xhr.open('/');

      assert.equal(xhr.readyState, MockXMLHttpRequest.STATE_OPENED);

    });

  });

  describe('.send()', function() {

    it('should have a request body', function (done) {

      MockXMLHttpRequest.addHandler(function(req, res) {
        assert.equal(req.body(), 'Hello World!');
        done();
      });

      var xhr = new MockXMLHttpRequest();
      xhr.open('/');
      xhr.send('Hello World!');

    });

    it('should not have a request body', function (done) {

      MockXMLHttpRequest.addHandler(function(req, res) {
        assert.equal(req.body(), null);
        done();
      });

      var xhr = new MockXMLHttpRequest();
      xhr.open('/');
      xhr.send();

    });

    it('should time out after 100ms', function (done) {
      var start, end;

      MockXMLHttpRequest.addHandler(function (req, res) {
        return res.timeout(true);
      });

      var xhr = new MockXMLHttpRequest();
      xhr.timeout = 100;
      xhr.open('/');
      xhr.ontimeout = function () {
        end = Date.now();
        assert(end-start >= 100);
        assert(xhr.readyState === 4);
        done();
      };
      start = Date.now();
      xhr.send();

    });

    it('should time out after 100ms even though the timeout is set to timeout after 10ms', function (done) {
      var start, end;

      MockXMLHttpRequest.addHandler(function (req, res) {
        return res.timeout(100);
      });

      var xhr = new MockXMLHttpRequest();
      xhr.timeout = 10;
      xhr.open('/');
      xhr.ontimeout = function() {
        end = Date.now();
        assert(end-start >= 100);
        assert(xhr.readyState === 4);
        done();
      };
      start = Date.now();
      xhr.send();

    });

    it('should not time out after 100ms when the request has been aborted', function (done) {
      var aborted = false, timedout = false;

      MockXMLHttpRequest.addHandler(function (req, res) {
        return res.timeout(100);
      });

      var xhr = new MockXMLHttpRequest();
      xhr.open('/');
      xhr.ontimeout = function() {
        timedout = true;
      };
      xhr.onabort = function() {
        aborted = true;
      };
      xhr.send();

      xhr.abort();

      setTimeout(function() {
        assert(aborted);
        assert(!timedout);
        done();
      }, 110)

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
        assert.equal(xhr.getAllResponseHeaders(), 'content-type: application/json\r\nx-powered-by: SecretSauce\r\n');
        done();
      };
      xhr.send();

    });

  });

  describe('async response', function() {
    it('when a response returns a promise wait for it to resolve', function(done){
      MockXMLHttpRequest.addHandler(function(req, res) {
        return new Promise(function(success){
          success(
            res
              .header('Content-Type', 'application/json')
              .header('X-Powered-By', 'SecretSauce')
          );
        });
      })

      var xhr = new MockXMLHttpRequest();
      xhr.open('/');
      xhr.onload = function() {
        assert.equal(xhr.getAllResponseHeaders(), 'content-type: application/json\r\nx-powered-by: SecretSauce\r\n');
        done();
      };
      xhr.send();
    });
  });

});
