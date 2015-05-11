
/**
 * The mocked request data
 * @constructor
 */
function Request(xhr) {
  this._method    = xhr.method;
  this._url       = xhr.url;
  this._headers   = {};
  this.headers(xhr._requestHeaders);
}

/**
 * Get/set the HTTP method
 * @returns {string}
 */
Request.prototype.method = function() {
  return this._method;
};

/**
 * Get/set the HTTP URL
 * @returns {string}
 */
Request.prototype.url = function() {
  return this._url;
};

/**
 * Get/set a HTTP header
 * @param   {string} name
 * @param   {string} [value]
 * @returns {string|undefined|Request}
 */
Request.prototype.header = function(name, value) {
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
 * @returns {Object|Request}
 */
Request.prototype.headers = function(headers) {
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

module.exports = Request;