var assert               = require('assert');
var MockXMLHttpRequest   = require('../lib/MockXMLHttpRequest');
var MockRequest          = require('../lib/MockRequest');

describe('MockRequest', function() {
  it('should parse the query', function() {
    var xhr = new MockXMLHttpRequest();
    xhr.open('GET', 'https://example.com/path?a=1&b=2');
    var req = new MockRequest(xhr);
    assert.deepEqual(req.query(), { a: 1, b: 2});
  });
});
