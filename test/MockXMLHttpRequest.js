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

    it('should time out after 100ms', function(done) {

      MockXMLHttpRequest.addHandler(function(req, res) {
        return res.timeout(true);
      });

      var xhr = new MockXMLHttpRequest();
      xhr.timeout = 100;
      xhr.open('/');
      xhr.ontimeout = function() {
        assert(xhr.readyState === 4);
        done();
      };
      xhr.send();

    });

  });

});
