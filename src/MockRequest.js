import URL from 'url-parse';

export default class MockRequest {
  /** @private */
  _method = '';

  /** @private */
  _url = null;

  /** @private */
  _headers = {};

  /** @private */
  _body = null;

  /** @private */
  _events = null;

  constructor(events) {
    this._events = events;
  }

  /**
   * Get/set the HTTP method
   * @param string [method]
   * @returns {MockRequest|string}
   */
  method(method) {
    if (arguments.length) {
      this._method = method;
      return this;
    } else {
      return this._method;
    }
  }

  /**
   * Get/set the HTTP URL
   * @param string [url]
   * @returns {MockRequest|URL|null}
   */
  url(url) {
    if (arguments.length) {
      this._url = url ? new URL(url, {protocol: ''}, true) : null;
      return this;
    } else {
      return this._url;
    }
  }

  /**
   * Get/set a HTTP header
   * @param   {string} name
   * @param   {string} [value]
   * @returns {MockRequest|string|null}
   */
  header(name, value) {
    if (arguments.length === 2) {
      this._headers[name.toLowerCase()] = value;
      return this;
    } else {
      return this._headers[name.toLowerCase()] || null;
    }
  }

  /**
   * Get/set all of the HTTP headers
   * @param   {object} [headers]
   * @returns {MockRequest|object}
   */
  headers(headers) {
    if (arguments.length) {
      for (let name in headers) {
        if (headers.hasOwnProperty(name)) {
          this.header(name, headers[name]);
        }
      }
      return this;
    } else {
      return this._headers;
    }
  }

  /**
   * Get/set the HTTP body
   * @param   {*} [body]
   * @returns {MockRequest|*}
   */
  body(body) {
    if (arguments.length) {
      this._body = body;
      return this;
    } else {
      return this._body;
    }
  }

  /**
   * Trigger request progress event
   * @param   {number} [loaded]
   * @param   {number} [total]
   * @param   {boolean} [lengthComputable]
   * @returns {MockResponse}
   */
  progress(loaded, total, lengthComputable) {
    //TODO: consider this signature (put lengthComputable first?)
    this._events.dispatchEvent({
      type: 'progress',
      lengthComputable: lengthComputable || true,
      loaded: loaded || 0,
      total: total || 0
    });
    return this;
  }
}
