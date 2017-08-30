var window = require('global');
var assert = require('assert');
var mock = require('..');

describe('xhr-mock', function() {
  describe('.setup() and teardown()', function() {
    it('should setup and teardown the mock XMLHttpRequest class', function() {
      var xhr = window.XMLHttpRequest;
      mock.setup();
      assert.notEqual(window.XMLHttpRequest, xhr);
      mock.teardown();
      assert.equal(window.XMLHttpRequest, xhr);
    });

    it('should remove any handlers', function() {
      mock.get('http://www.google.com/', function() {});
      mock.setup();
      assert.equal(mock.XMLHttpRequest.handlers.length, 0);
      mock.get('http://www.google.com/', function() {});
      mock.teardown();
      assert.equal(mock.XMLHttpRequest.handlers.length, 0);
    });
  });

  describe('.mock()', function() {
    it('should allow registering the handler', function(done) {
      mock.setup();

      mock.mock(function(req, res) {
        return res.status(200).body('OK');
      });

      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/');
      xhr.onload = function() {
        assert.equal(xhr.responseText, 'OK');
        mock.teardown();
        done();
      };
      xhr.send();
    });

    it('should allow registering a specific URL handler', function(done) {
      mock.setup();

      mock.mock('GET', '/a', function(req, res) {
        return res.status(200).body('A');
      });

      mock.mock('GET', '/b', function(req, res) {
        return res.status(200).body('B');
      });

      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/a');
      xhr.onload = function() {
        assert.equal(xhr.responseText, 'A');
        mock.teardown();
        done();
      };
      xhr.send();
    });

    it('should allow registering a handler with URL regexp', function(done) {
      mock.setup();

      mock.mock('POST', /\/a\/\d+/, function(req, res) {
        return res.status(200).body(req.url().split('/')[2]);
      });

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/a/123');
      xhr.onload = function() {
        assert.equal(xhr.responseText, '123');
        mock.teardown();
        done();
      };
      xhr.send();
    });
  });

  it('should match a global regexp twice', function(done) {
    mock.setup();

    mock.mock('POST', /users\/api.*/g, function(req, res) {
      return res.status(200).body(req.url().split('/')[2]);
    });

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/users/api');
    xhr.onload = function() {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/users/api');
      xhr.onload = function() {
        mock.teardown();
        done();
      };
      xhr.send();
    };
    xhr.send();
  });
});
