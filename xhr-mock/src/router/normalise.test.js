'use strict';
exports.__esModule = true;
var normalise_1 = require('./normalise');
describe('normaliseRequest()', function() {
  it('should set the default version', function() {
    var req = {};
    expect(normalise_1.normaliseRequest(req)).toMatchObject({
      version: '1.1'
    });
  });
  it('should set the default method', function() {
    var req = {};
    expect(normalise_1.normaliseRequest(req)).toMatchObject({
      method: 'GET'
    });
  });
  it('should set the default uri', function() {
    var req = {};
    expect(normalise_1.normaliseRequest(req)).toMatchObject({
      uri: '/'
    });
  });
  it('should set the default headers', function() {
    var req = {};
    expect(normalise_1.normaliseRequest(req)).toMatchObject({
      headers: {}
    });
  });
  it('should set the default body', function() {
    var req = {};
    expect(normalise_1.normaliseRequest(req)).toMatchObject({
      body: undefined
    });
  });
  it('should uppercase the method', function() {
    var req = {method: 'post'};
    expect(normalise_1.normaliseRequest(req)).toMatchObject({
      method: 'POST'
    });
  });
  it('should lowercase the headers', function() {
    var req = {headers: {'Content-Type': 'application/json'}};
    expect(normalise_1.normaliseRequest(req)).toMatchObject({
      headers: {'content-type': 'application/json'}
    });
  });
});
describe('normaliseResponse()', function() {
  it('should set the default version', function() {
    var res = {};
    expect(normalise_1.normaliseResponse(res)).toMatchObject({
      version: '1.1'
    });
  });
  it('should set the default status', function() {
    var res = {};
    expect(normalise_1.normaliseResponse(res)).toMatchObject({
      status: 200
    });
  });
  it('should set the default reason', function() {
    var res = {};
    expect(normalise_1.normaliseResponse(res)).toMatchObject({
      reason: 'OK'
    });
  });
  it('should set the default headers', function() {
    var res = {};
    expect(normalise_1.normaliseResponse(res)).toMatchObject({
      headers: {}
    });
  });
  it('should set the default body', function() {
    var res = {};
    expect(normalise_1.normaliseResponse(res)).toMatchObject({
      body: undefined
    });
  });
  it('should set the default reason based on the status', function() {
    var res = {status: 204};
    expect(normalise_1.normaliseResponse(res)).toMatchObject({
      reason: 'No Content'
    });
  });
  it('should set the reason', function() {
    var res = {status: 204, reason: 'Other'};
    expect(normalise_1.normaliseResponse(res)).toMatchObject({
      reason: 'Other'
    });
  });
  it('should lowercase the headers', function() {
    var res = {headers: {'Content-Type': 'application/json'}};
    expect(normalise_1.normaliseResponse(res)).toMatchObject({
      headers: {'content-type': 'application/json'}
    });
  });
});
