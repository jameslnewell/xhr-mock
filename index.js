
var MockXMLHttpRequest  = require('./lib/MockXMLHttpRequest');
var real                = window.XMLHttpRequest;
var mock                = MockXMLHttpRequest;

module.exports = {

  /**
   * Replace the native XHR with the mocked XHR
   * @returns {exports}
   */
  setup: function() {
    window.XMLHttpRequest = mock;
    return this;
  },

  /**
   * Replace the mocked XHR with the native XHR and remove any handlers
   * @returns {exports}
   */
  teardown: function() {
    window.XMLHttpRequest = real;
    MockXMLHttpRequest.handlers = [];
    return this;
  },

  /**
   * Mock a request
   * @param   {Function} fn
   * @returns {exports}
   */
  mock: function(fn) {
    MockXMLHttpRequest.addHandler(fn);
    return this;
  },

  /**
   * Mock a request
   * @param   {String}    url
   * @param   {Function}  fn
   * @returns {exports}
   */
  get: function(url, fn) {
    var method = 'GET';
    MockXMLHttpRequest.addHandler(function(request) {
      if (request.method == method && request.url == url) {
        fn(request);
        return true;
      }
    });
    return this;
  }


};