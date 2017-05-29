import window from 'global';
import createHandler from './createHandler';
import MockXMLHttpRequest from './MockXMLHttpRequest';

const realXHR = window.XMLHttpRequest;
const mockXHR = MockXMLHttpRequest;

const XHRMock = {
  /**
   * Replace the native XHR with the mock XHR and remove any handlers
   * @returns {XHRMock}
   */
  setup() {
    window.XMLHttpRequest = mockXHR;
    this.reset();
    return this;
  },

  /**
   * Restore the native XHR and remove any handlers
   * @returns {XHRMock}
   */
  teardown() {
    this.reset();
    window.XMLHttpRequest = realXHR;
    return this;
  },

  /**
   * Remove any handlers
   * @returns {XHRMock}
   */
  reset() {
    MockXMLHttpRequest.removeAllHandlers();
    return this;
  },

  /**
   * Mock a request
   * @param   {string}    [method]
   * @param   {string}    [url]
   * @param   {Function}  fn
   * @returns {XHRMock}
   */
  mock(method, url, fn) {
    const handler = arguments.length === 3
      ? createHandler(method, url, fn)
      : method;
    MockXMLHttpRequest.addHandler(handler);
    return this;
  },

  /**
   * Mock a GET request
   * @param   {String}    url
   * @param   {Function}  fn
   * @returns {XHRMock}
   */
  get(url, fn) {
    return this.mock('GET', url, fn);
  },

  /**
   * Mock a POST request
   * @param   {String}    url
   * @param   {Function}  fn
   * @returns {XHRMock}
   */
  post(url, fn) {
    return this.mock('POST', url, fn);
  },

  /**
   * Mock a PUT request
   * @param   {String}    url
   * @param   {Function}  fn
   * @returns {XHRMock}
   */
  put(url, fn) {
    return this.mock('PUT', url, fn);
  },

  /**
   * Mock a PATCH request
   * @param   {String}    url
   * @param   {Function}  fn
   * @returns {XHRMock}
   */
  patch(url, fn) {
    return this.mock('PATCH', url, fn);
  },

  /**
   * Mock a DELETE request
   * @param   {String}    url
   * @param   {Function}  fn
   * @returns {XHRMock}
   */
  delete(url, fn) {
    return this.mock('DELETE', url, fn);
  }
};

export default XHRMock;
