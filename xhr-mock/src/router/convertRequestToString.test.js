'use strict';
exports.__esModule = true;
var convertRequestToString_1 = require('./convertRequestToString');
describe('convertRequestToString()', function() {
  it('should have no headers and no body', function() {
    var req = {
      version: '1.1',
      method: 'GET',
      uri: '/',
      headers: {},
      body: undefined
    };
    var out = 'GET / HTTP/1.1\n\n';
    expect(convertRequestToString_1.convertRequestToString(req)).toEqual(out);
  });
  it('should have headers', function() {
    var req = {
      version: '1.1',
      method: 'GET',
      uri: '/',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: undefined
    };
    var out = 'GET / HTTP/1.1\nContent-Type: application/json; charset=UTF-8\n\n';
    expect(convertRequestToString_1.convertRequestToString(req)).toEqual(out);
  });
  it('should have a body', function() {
    var req = {
      version: '1.1',
      method: 'GET',
      uri: '/',
      headers: {},
      body: '<html></html>'
    };
    var out = 'GET / HTTP/1.1\n\n<html></html>';
    expect(convertRequestToString_1.convertRequestToString(req)).toEqual(out);
  });
  it('should have headers and a body', function() {
    var req = {
      version: '1.1',
      method: 'GET',
      uri: '/',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: '<html></html>'
    };
    var out = 'GET / HTTP/1.1\nContent-Type: application/json; charset=UTF-8\n\n<html></html>';
    expect(convertRequestToString_1.convertRequestToString(req)).toEqual(out);
  });
});
