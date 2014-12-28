
var MockXMLHttpRequest  = require('./lib/MockXMLHttpRequest');
var real                = window.XMLHttpRequest;
var mock                = MockXMLHttpRequest;

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
	  MockXMLHttpRequest.handlers = [];
    return this;
  },

  /**
   * Replace the mocked XHR with the native XHR and remove any handlers
   * @returns {exports}
   */
  teardown: function() {
	  MockXMLHttpRequest.handlers = [];
    window.XMLHttpRequest = real;
    return this;
  },

  /**
   * Mock a request
   * @param   {Function} fn
   * @returns {exports}
   */
  mock: function(method, url, fn) {
	  var handler = fn;

	  if (arguments.length === 3) {
		  handler = function(request) {
			  if (request.method == method && request.url == url) {
				  fn(request);
				  return true;
			  }
		  };
	  }

    MockXMLHttpRequest.addHandler(handler);

    return this;
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
	}

};