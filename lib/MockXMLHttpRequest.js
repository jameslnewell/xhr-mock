
//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
//https://xhr.spec.whatwg.org/
//http://www.w3.org/TR/2006/WD-XMLHttpRequest-20060405/

MockXMLHttpRequest.STATE_UNSENT  = 0;
MockXMLHttpRequest.STATE_OPENED           = 1;
MockXMLHttpRequest.STATE_HEADERS_RECEIVED           = 2;
MockXMLHttpRequest.STATE_LOADING      = 3;
MockXMLHttpRequest.STATE_DONE         = 4;

/**
 * The request handlers
 * @private
 * @type {Array}
 */
MockXMLHttpRequest.handlers = [];

/**
 * Add a request handler
 * @param   {Function} fn
 * @returns {MockXMLHttpRequest}
 */
MockXMLHttpRequest.addHandler = function(fn) {
  MockXMLHttpRequest.handlers.push(fn);
  return this;
};

/**
 * Remove a request handler
 * @param   {Function} fn
 * @returns {MockXMLHttpRequest}
 */
MockXMLHttpRequest.removeHandler = function(fn) {
  throw new Error;
  //MockXMLHttpRequest.handlers.push(fn);
  return this;
};

/**
 * Handle a request
 * @param   {Object} request
 * @returns {Boolean}
 */
MockXMLHttpRequest.handle = function(request) {

  for (var i=0; i<MockXMLHttpRequest.handlers.length; ++i) {

    //get the generator to create a response to the request
    var response = MockXMLHttpRequest.handlers[i](request);

    //return the generated response or keep looking
    if (response) {
      return response;
    }

  }

  return false;
};

/**
 * Mock XMLHttpRequest
 * @constructor
 */
function MockXMLHttpRequest() {
  this.reset();
}

/**
 * Reset the response values
 * @private
 */
MockXMLHttpRequest.prototype.reset = function() {

  this.response     = null;
  this.responseType = '';
  this.responseText = '';

  this.status       = '';
  this.statusText   = '';

  this.readyState   = MockXMLHttpRequest.STATE_UNSENT;
};

/**
 * Trigger an event
 * @param   {String} event
 * @returns {MockXMLHttpRequest}
 */
MockXMLHttpRequest.prototype.trigger = function(event) {

  if (this['on'+event]) {
    this['on'+event]();
  }

	if (this['onreadystatechange']) {
		this['onreadystatechange']();
	}

  //iterate over the listeners

  return this;
};

MockXMLHttpRequest.prototype.open = function(method, url, async, user, password) {
  this.reset();
  this.method   = method;
  this.url      = url;
  this.async    = async;
  this.user     = user;
  this.password = password;
  this.data     = null;
};

MockXMLHttpRequest.prototype.setRequestHeader = function(header, value) {
};

MockXMLHttpRequest.prototype.overrideMimeType = function(mime) {
};

MockXMLHttpRequest.prototype.send = function(data) {
  var self = this;
  this.data = data;

  setTimeout(function() {

    var handled = MockXMLHttpRequest.handle(self);

    if (handled) {

      //trigger a success event because the request was handled
      self.readyState = MockXMLHttpRequest.STATE_DONE;
      self.trigger('load');

    } else {

      //trigger an error because the request was handled
      self.readyState = MockXMLHttpRequest.STATE_DONE;
      self.trigger('error');

    }

  }, 0);

};

MockXMLHttpRequest.prototype.abort = function() {
};

MockXMLHttpRequest.prototype.getAllResponseHeaders = function(header) {
	if (this.readyState === MockXMLHttpRequest.STATE_UNSENT) {
		return '';
	}
};

MockXMLHttpRequest.prototype.geResponseHeader = function(header) {
};

MockXMLHttpRequest.prototype.addEventListener = function(event, listener) {
};

MockXMLHttpRequest.prototype.removeEventListener = function(event, listener) {
};

module.exports = MockXMLHttpRequest;