
/**
 * The mocked request data
 * @constructor
 */
function Request(xhr) {
  this._method = xhr.method;
  this._url    = xhr.url;
}

/**
 * Get/set the HTTP method
 * @returns {string}
 */
Request.prototype.method = function(code) {
  return this._method;
};

/**
 * Get/set the HTTP URL
 * @returns {string}
 */
Request.prototype.url = function() {
  return this._url;
};

module.exports = Request;