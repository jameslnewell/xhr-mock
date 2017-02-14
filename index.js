var Promise                 = require('lie');
var window                  = require('global');
var MockXMLHttpRequest      = require('./lib/MockXMLHttpRequest');
var real                    = window.XMLHttpRequest;
var mock                    = MockXMLHttpRequest;

window.xhrMockProxyHandler  = require('./lib/xhr-mock-proxy-handler');

/**
 * Mock utility
 */
module.exports = {

  XMLHttpRequest: MockXMLHttpRequest,

  /**
   * Replace the native XHR with the mocked XHR
   * @returns {exports}
   */
  setup: function() {
    window.XMLHttpRequest = mock;
    return this.reset();
  },

  /**
   * Replace the mocked XHR with the native XHR and remove any handlers
   * @returns {exports}
   */
  teardown: function() {
    window.XMLHttpRequest = real;
    return this.reset();
  },

  /**
   * Remove any handlers
   * @returns {exports}
   */
  reset: function() {
    MockXMLHttpRequest.reset();
    return this;
  },

  /**
   * Mock a request
   * @param   {string}    [method]
   * @param   {string}    [url]
   * @param   {Function}  fn
   * @returns {exports}
   */
  mock: function(method, url, fn) {
    var handler, matcher;
    if (arguments.length === 3) {
      function match(string, pattern) {
        return new RegExp(pattern).test(string);
      }
      handler = function(req, res) {
        if (match(req.method(), method)
            && match(req.url(), url)) {
          return fn(req, res);
        }
        return false;
      };
    } else {
      handler = method;
    }

    MockXMLHttpRequest.addHandler(handler);
  },

	any: function(fn) {
		return this.mock('.*', '.*', fn);
	},

	/**
	 * Mock a GET request
	 * @param   {String}    url
	 * @param   {Function}  fn
	 * @returns {exports}
	 */
	get: function(url, fn) {
		return this.mock('GET', url, fn);
	},

  /**
   * Mock a POST request
   * @param   {String}    url
   * @param   {Function}  fn
   * @returns {exports}
   */
  post: function(url, fn) {
    return this.mock('POST', url, fn);
  },

  /**
   * Mock a PUT request
   * @param   {String}    url
   * @param   {Function}  fn
   * @returns {exports}
   */
  put: function(url, fn) {
    return this.mock('PUT', url, fn);
  },

  /**
   * Mock a PATCH request
   * @param   {String}    url
   * @param   {Function}  fn
   * @returns {exports}
   */
  patch: function(url, fn) {
    return this.mock('PATCH', url, fn);
  },

  /**
   * Mock a DELETE request
   * @param   {String}    url
   * @param   {Function}  fn
   * @returns {exports}
   */
  delete: function(url, fn) {
    return this.mock('DELETE', url, fn);
  }

};
