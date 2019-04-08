'use strict';
exports.__esModule = true;
var convertResponseToString_1 = require('./convertResponseToString');
describe('convertResponseToString()', function() {
  it('should have no headers and no body', function() {
    var res = {
      version: '1.1',
      status: 200,
      reason: 'OK',
      headers: {},
      body: undefined
    };
    var out = 'HTTP/1.1 200 OK\n\n';
    expect(convertResponseToString_1.convertResponseToString(res)).toEqual(out);
  });
  it('should have headers', function() {
    var res = {
      version: '1.1',
      status: 200,
      reason: 'OK',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: undefined
    };
    var out = 'HTTP/1.1 200 OK\nContent-Type: application/json; charset=UTF-8\n\n';
    expect(convertResponseToString_1.convertResponseToString(res)).toEqual(out);
  });
  it('should have a body', function() {
    var res = {
      version: '1.1',
      status: 200,
      reason: 'OK',
      headers: {},
      body: '<html></html>'
    };
    var out = 'HTTP/1.1 200 OK\n\n<html></html>';
    expect(convertResponseToString_1.convertResponseToString(res)).toEqual(out);
  });
  it('should have headers and a body', function() {
    var res = {
      version: '1.1',
      status: 200,
      reason: 'OK',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: '<html></html>'
    };
    var out = 'HTTP/1.1 200 OK\nContent-Type: application/json; charset=UTF-8\n\n<html></html>';
    expect(convertResponseToString_1.convertResponseToString(res)).toEqual(out);
  });
});
