var URL = require('url-parse');

/**
 * The mocked request data
 * @constructor
 */
function MockRequest(xhr) {
  this._xhr       = xhr
  this._method    = xhr.method;
  this._url       = xhr.url;
  this._headers   = {};
  this.headers(xhr._requestHeaders);
  this.body(xhr.data);
}

/**
 * Get/set the HTTP method
 * @returns {string}
 */
MockRequest.prototype.method = function() {
  return this._method;
};

/**
 * Get/set the HTTP URL
 * @returns {string}
 */
MockRequest.prototype.url = function() {
  return this._url;
};

/**
 * Get/set the parsed URL query
 * @returns {Object}
 */
MockRequest.prototype.query = function() {
  var url = new URL(this._url, true);
  return url.query;
}

/**
 * Get/set a HTTP header
 * @param   {string} name
 * @param   {string} [value]
 * @returns {string|undefined|MockRequest}
 */
MockRequest.prototype.header = function(name, value) {
  if (arguments.length === 2) {
    this._headers[name.toLowerCase()] = value;
    return this;
  } else {
    return this._headers[name.toLowerCase()] || null;
  }
};

/**
 * Get/set all of the HTTP headers
 * @param   {Object} [headers]
 * @returns {Object|MockRequest}
 */
MockRequest.prototype.headers = function(headers) {
  if (arguments.length) {
    for (var name in headers) {
      if (headers.hasOwnProperty(name)) {
        this.header(name, headers[name]);
      }
    }
    return this;
  } else {
    return this._headers;
  }
};

/**
 * Get/set the HTTP body
 * @param   {string} [body]
 * @returns {string|MockRequest}
 */
MockRequest.prototype.body = function(body) {
  if (arguments.length) {
    this._body = body;
    return this;
  } else {
    return this._body;
  }
};

/**
 * Trigger progress event
 * @param   {number} [loaded]
 * @param   {number} [total]
 * @param   {boolean} [lengthComputable]
 * @returns {}
 */
MockRequest.prototype.progress = function(loaded, total, lengthComputable) {
  this._xhr.trigger('progress', {
    lengthComputable: lengthComputable || true,
    loaded: loaded,
    total: total
  })
};

module.exports = MockRequest;
