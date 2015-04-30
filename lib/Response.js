
/**
 * The mocked response data
 * @constructor
 */
function Response() {
  this._status      = 200;
  this._headers     = {};
  this._body        = '';
  this._readyState  = 4; //the request is DONE
}

/**
 * Get/set the HTTP status
 * @param   {number} [code]
 * @returns {number|Response}
 */
Response.prototype.status = function(code) {
  if (arguments.length) {
    this._status = code;
    return this;
  } else {
    return this._status;
  }
};

/**
 * Get/set a HTTP header
 * @param   {string} name
 * @param   {string} [value]
 * @returns {string|undefined|Response}
 */
Response.prototype.header = function(name, value) {
  if (arguments.length === 2) {
    this._headers[name.toLowerCase()] = value;
    return this;
  } else {
    return this._headers[name.toLowerCase()];
  }
};

/**
 * Get/set all of the HTTP headers
 * @param   {Object} [headers]
 * @returns {Object|Response}
 */
Response.prototype.headers = function(headers) {
  if (arguments.length) {
    this._headers = headers;
    return this;
  } else {
    return this._headers;
  }
};

/**
 * Get/set the HTTP body
 * @param   {string} body
 * @returns {string|Response}
 */
Response.prototype.body = function(body) {
  if (arguments.length) {
    this._body = body;
    return this;
  } else {
    return this._body;
  }
};

/**
 * Get/set the ready state
 * @param   {number} [state]
 * @returns {number|Response}
 */
Response.prototype.readyState = function(state) {
  if (arguments.length) {
    this._readyState = state;
    return this;
  } else {
    return this._readyState;
  }
};

module.exports = Response;
