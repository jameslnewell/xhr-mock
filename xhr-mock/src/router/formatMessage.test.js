'use strict';
exports.__esModule = true;
var formatMessage_1 = require('./formatMessage');
describe('formatMessage()', function() {
  it('should contain the request string', function() {
    var req = {
      version: '1.1',
      method: 'GET',
      uri: '/foo/bar',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: new Blob()
    };
    var err = new Error('Uh oh!');
    var formatted = formatMessage_1.formatMessage('None of the registered handlers returned a response', {
      req: req,
      err: err
    });
    expect(formatted).toContain('GET /foo/bar HTTP/1.1');
    expect(formatted).toContain('Content-Type: application/json; charset=UTF-8');
  });
  it('should contain the response string', function() {
    var req = {
      version: '1.1',
      method: 'GET',
      uri: '/foo/bar',
      headers: {},
      body: undefined
    };
    var res = {
      version: '1.1',
      status: 200,
      reason: 'OK',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: new Blob()
    };
    var formatted = formatMessage_1.formatMessage('None of the registered handlers returned a response', {
      req: req,
      res: res
    });
    expect(formatted).toContain('HTTP/1.1 200 OK');
    expect(formatted).toContain('Content-Type: application/json; charset=UTF-8');
  });
  it('should contain the error message and stack trace', function() {
    var req = {
      version: '1.1',
      method: 'GET',
      uri: '/foo/bar',
      headers: {},
      body: undefined
    };
    var err = new Error('Uh oh!');
    var formatted = formatMessage_1.formatMessage('None of the registered handlers returned a response', {
      req: req,
      err: err
    });
    expect(formatted).toContain('Uh oh');
    expect(formatted).toContain('formatMessage.test.ts');
  });
});
