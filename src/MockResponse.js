export default class MockResponse {
  /** @private */
  _status = -1;

  /** @private */
  _reason = '';

  /** @private */
  _headers = {};

  /** @private */
  _body = '';

  /** @private */
  _target = null;

  constructor(events) {
    this._target = events;
  }

  /**
   * Get/set the HTTP status code
   * @param   {number} [status]
   * @returns {MockResponse|number}
   */
  status(status) {
    if (arguments.length) {
      this._status = status;
      return this;
    } else {
      return this._status;
    }
  }

  /**
   * Get/set the HTTP reason reason
   * @param   {string} [reason]
   * @returns {MockResponse|string}
   */
  reason(reason) {
    if (arguments.length) {
      this._reason = reason;
      return this;
    } else {
      return this._reason;
    }
  }

  statusText(reason) {
    console.warn(
      'xhr-mock: MockResponse.statusText() has been deprecated. Use MockResponse.reason() instead.'
    );
    return this.reason(reason);
  }

  /**
   * Get/set a HTTP header
   * @param   {string} name
   * @param   {string} [value]
   * @returns {MockResponse|string|null}
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
   * @returns {MockResponse|object}
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
   * Get/set the HTTP body content
   * @param   {string} [body]
   * @returns {MockResponse|string}
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
   * Trigger response progress event
   * @param   {number} [loaded]
   * @param   {number} [total]
   * @param   {boolean} [lengthComputable]
   * @returns {MockResponse}
   */
  progress(loaded, total, lengthComputable) {
    this._target.dispatchEvent({
      type: 'progress',
      lengthComputable: lengthComputable || true,
      loaded: loaded || 0,
      total: total || 0
    });
    return this;
  }
}
