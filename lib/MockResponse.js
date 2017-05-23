
/**
 * The mocked response data
 * @constructor
 */
function MockResponse(xhr) {
  this._xhr         = xhr;
  this._status      = 200;
  this._statusText  = 'OK';
  this._headers     = {};
  this._body        = '';
  this._timeout     = false;
}

/**
 * Get/set the HTTP status
 * @param   {number} [code]
 * @returns {number|MockResponse}
 */
MockResponse.prototype.status = function(code) {
  if (arguments.length) {
    this._status = code;
    return this;
  } else {
    return this._status;
  }
};

/**
 * Get/set the HTTP statusText
 * @param   {string} [statusText]
 * @returns {string|MockResponse}
 */
 MockResponse.prototype.statusText = function(statusText) {
   if (arguments.length) {
     this._statusText = statusText;
     return this;
   } else {
     return this._statusText;
   }
 };

/**
 * Get/set a HTTP header
 * @param   {string} name
 * @param   {string} [value]
 * @returns {string|undefined|MockResponse}
 */
MockResponse.prototype.header = function(name, value) {
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
 * @returns {Object|MockResponse}
 */
MockResponse.prototype.headers = function(headers) {
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
 * @returns {string|MockResponse}
 */
MockResponse.prototype.body = function(body) {
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
 * @returns {MockResponse}
 */
MockResponse.prototype.progress = function(loaded, total, lengthComputable) {
  this._xhr.trigger('progress', {
    lengthComputable: lengthComputable || true,
    loaded: loaded,
    total: total
  });
  return this;
};

/**
 * Get/set the HTTP timeout
 * @param   {boolean|number} [timeout]
 * @returns {boolean|number|MockResponse}
 */
MockResponse.prototype.timeout = function(timeout) {
  if (arguments.length) {
    this._timeout = timeout;
    return this;
  } else {
    return this._timeout;
  }
};

module.exports = MockResponse;
