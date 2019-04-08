'use strict';
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
exports.__esModule = true;
var createHandler_1 = require('./createHandler');
var req = {
  version: '1.1',
  method: 'get',
  uri: '/foo/bar',
  headers: {},
  body: undefined
};
var res = {
  version: '1.1',
  status: 200,
  reason: 'OK',
  headers: {},
  body: undefined
};
var ctx = {
  sync: false
};
var alwaysReturnsResponseHandler = function() {
  return res;
};
describe('createRouteHandler()', function() {
  it('should match the method', function() {
    expect(
      createHandler_1.createHandler('*', '/foo/bar', alwaysReturnsResponseHandler)(
        __assign({}, req, {method: 'get'}),
        ctx
      )
    ).toEqual(res);
    expect(
      createHandler_1.createHandler('get', '/foo/bar', alwaysReturnsResponseHandler)(
        __assign({}, req, {method: 'get'}),
        ctx
      )
    ).toEqual(res);
    expect(
      createHandler_1.createHandler('post', '/foo/bar', alwaysReturnsResponseHandler)(
        __assign({}, req, {method: 'post'}),
        ctx
      )
    ).toEqual(res);
    expect(
      createHandler_1.createHandler('put', '/foo/bar', alwaysReturnsResponseHandler)(
        __assign({}, req, {method: 'put'}),
        ctx
      )
    ).toEqual(res);
    expect(
      createHandler_1.createHandler('patch', '/foo/bar', alwaysReturnsResponseHandler)(
        __assign({}, req, {method: 'patch'}),
        ctx
      )
    ).toEqual(res);
    expect(
      createHandler_1.createHandler('delete', '/foo/bar', alwaysReturnsResponseHandler)(
        __assign({}, req, {method: 'delete'}),
        ctx
      )
    ).toEqual(res);
  });
  it('should not match the method', function() {
    expect(
      createHandler_1.createHandler('options', '/foo/bar', alwaysReturnsResponseHandler)(
        __assign({}, req, {method: 'get'}),
        ctx
      )
    ).toBeUndefined();
    expect(
      createHandler_1.createHandler('head', '/foo/bar', alwaysReturnsResponseHandler)(
        __assign({}, req, {method: 'post'}),
        ctx
      )
    ).toBeUndefined();
  });
  it('should match the uri', function() {
    expect(createHandler_1.createHandler('get', '/foo/bar', alwaysReturnsResponseHandler)(req, ctx)).toEqual(res);
    expect(createHandler_1.createHandler('get', '/foo/:bar', alwaysReturnsResponseHandler)(req, ctx)).toEqual(res);
    expect(createHandler_1.createHandler('get', /bar/i, alwaysReturnsResponseHandler)(req, ctx)).toEqual(res);
    expect(
      createHandler_1.createHandler('get', 'http://example.com/foo/bar', alwaysReturnsResponseHandler)(req, ctx)
    ).toEqual(res);
  });
  it('should not match the uri', function() {
    expect(createHandler_1.createHandler('get', '/foo/baz', alwaysReturnsResponseHandler)(req, ctx)).toBeUndefined();
    expect(createHandler_1.createHandler('get', '/bar/:foo', alwaysReturnsResponseHandler)(req, ctx)).toBeUndefined();
    expect(createHandler_1.createHandler('get', /abc/i, alwaysReturnsResponseHandler)(req, ctx)).toBeUndefined();
  });
  it('should call callback', function() {
    var cb = jest.fn(alwaysReturnsResponseHandler);
    createHandler_1.createHandler('get', '/foo/bar', cb)(req, ctx);
    expect(cb).toHaveBeenCalledTimes(1);
  });
  it('should return response', function() {
    var res = createHandler_1.createHandler('get', '/foo/bar', {
      status: 201
    })(req, ctx);
    expect(res).toEqual({
      status: 201
    });
  });
  it('should populate the request params', function() {
    var res = createHandler_1.createHandler('get', '/foo/:thing', function(req) {
      expect(req).toEqual(
        expect.objectContaining({
          params: {
            thing: 'bar'
          }
        })
      );
      return undefined;
    });
  });
  it('should match the host and port', function() {
    var res = createHandler_1.createHandler('get', 'https://localhost:3000/foo/bar', {})(
      __assign({}, req, {headers: {host: 'localhost:3000'}}),
      {sync: true}
    );
    expect(res).toEqual({});
  });
});
