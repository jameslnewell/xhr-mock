import window = require('global');
import Mock from '.';
import MockXMLHttpRequest from './MockXMLHttpRequest';

describe('xhr-mock', () => {
  it('should replace the original XHR on setup and restore the original XHR on teardown', () => {
    const originalXHR = window.XMLHttpRequest;
    expect(window.XMLHttpRequest).toBe(originalXHR);

    Mock.setup();
    expect(window.XMLHttpRequest).not.toBe(originalXHR);

    Mock.teardown();
    expect(window.XMLHttpRequest).toBe(originalXHR);
  });

  it('should remove all handlers on setup, on reset and on teardown', () => {
    Mock.get('http://www.google.com/', {});
    Mock.setup();
    expect(MockXMLHttpRequest.handlers).toHaveLength(0);

    Mock.get('http://www.google.com/', {});
    Mock.reset();
    expect(MockXMLHttpRequest.handlers).toHaveLength(0);

    Mock.get('http://www.google.com/', {});
    Mock.teardown();
    expect(MockXMLHttpRequest.handlers).toHaveLength(0);
  });
});
