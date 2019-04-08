'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = {next: verb(0), throw: verb(1), return: verb(2)}),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {value: op[1], done: false};
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return {value: op[0] ? op[1] : void 0, done: true};
    }
  };
var _this = this;
exports.__esModule = true;
var MockRouter_1 = require('./MockRouter');
var noop = function() {
  return undefined;
};
var createMockRouter = function() {
  var router = new MockRouter_1.MockRouter();
  router.after(noop);
  router.error(noop);
  return router;
};
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
describe('MockRouter', function() {
  it('should match the handler', function() {
    var router = createMockRouter();
    router.get('/foo/bar', function() {
      return res;
    });
    expect(router.routeSync(req, ctx)).toEqual(res);
  });
  it('should not match the handler', function() {
    var router = createMockRouter();
    router.post('/bar', function() {
      return res;
    });
    expect(function() {
      return router.routeSync(req, ctx);
    }).toThrow();
  });
  describe('.routeSync()', function() {
    it('should error when there are no handlers and no response is returned', function() {
      var router = createMockRouter();
      expect(function() {
        return router.routeSync(req, ctx);
      }).toThrow(/No handler returned a response/i);
    });
    it('should error when there are handlers and no response is returned', function() {
      var router = createMockRouter();
      router.use(noop);
      router.use(noop);
      expect(function() {
        return router.routeSync(req, ctx);
      }).toThrow(/No handler returned a response/i);
    });
    it('should error when there are handlers and a response is returned asynchronously', function() {
      var router = createMockRouter();
      router.use(function() {
        return Promise.resolve(res);
      });
      expect(function() {
        return router.routeSync(req, ctx);
      }).toThrow(/returned a response asynchronously/i);
    });
    it('should return a response when there are handlers and a response is returned synchronously', function() {
      var router = createMockRouter();
      router.use(function() {
        return res;
      });
      expect(router.routeSync(req, ctx)).toEqual(res);
    });
    it('should normalise the request', function() {
      expect.assertions(1);
      var req = {method: 'PUT', uri: '/'};
      var router = createMockRouter();
      router.put('/', function(req) {
        expect(req).toEqual({
          version: '1.1',
          method: 'PUT',
          uri: '/',
          params: {},
          headers: {},
          body: undefined
        });
        return {};
      });
      router.routeSync(req, ctx);
    });
    it('should normalise the response', function() {
      var req = {method: 'PUT', uri: '/'};
      var router = createMockRouter();
      router.put('/', function(req) {
        return {status: 201};
      });
      expect(router.routeSync(req, ctx)).toEqual({
        version: '1.1',
        status: 201,
        reason: 'Created',
        headers: {},
        body: undefined
      });
    });
    it('should call the before callback', function() {
      expect.assertions(1);
      var req = {uri: '/'};
      var router = createMockRouter();
      router.before(function(_a) {
        var req = _a.req;
        expect(req).toEqual({
          version: '1.1',
          method: 'GET',
          uri: '/',
          headers: {},
          body: undefined
        });
      });
      router.get('/', {});
      router.routeSync(req, ctx);
    });
    it('should call the after callback', function() {
      expect.assertions(2);
      var req = {uri: '/'};
      var router = createMockRouter();
      router.after(function(_a) {
        var req = _a.req,
          res = _a.res;
        expect(req).toEqual({
          version: '1.1',
          method: 'GET',
          uri: '/',
          headers: {},
          body: undefined
        });
        expect(res).toEqual({
          version: '1.1',
          status: 201,
          reason: 'Created',
          headers: {},
          body: undefined
        });
      });
      router.get('/', {status: 201});
      router.routeSync(req, ctx);
    });
    it('should call the error callback', function() {
      expect.assertions(2);
      var req = {uri: '/'};
      var router = createMockRouter();
      router.error(function(_a) {
        var req = _a.req,
          err = _a.err;
        expect(req).toEqual({
          version: '1.1',
          method: 'GET',
          uri: '/',
          headers: {},
          body: undefined
        });
        expect(err.message).toMatch('Oops');
      });
      router.get('/', function() {
        throw new Error('Oops');
      });
      try {
        router.routeSync(req, ctx);
      } catch (error) {}
    });
  });
  describe('.routeAsync()', function() {
    it('should error when there are no handlers and no response is returned', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var router, error_1;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              expect.assertions(1);
              router = createMockRouter();
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              return [4 /*yield*/, router.routeAsync(req, ctx)];
            case 2:
              _a.sent();
              return [3 /*break*/, 4];
            case 3:
              error_1 = _a.sent();
              expect(error_1).toEqual(
                expect.objectContaining({
                  message: expect.stringMatching(/No handler returned a response/i)
                })
              );
              return [3 /*break*/, 4];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    });
    it('should error when there are handlers and no response is returned', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var router, error_2;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              expect.assertions(1);
              router = createMockRouter();
              router.use(noop);
              router.use(noop);
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              return [4 /*yield*/, router.routeAsync(req, ctx)];
            case 2:
              _a.sent();
              return [3 /*break*/, 4];
            case 3:
              error_2 = _a.sent();
              expect(error_2).toEqual(
                expect.objectContaining({
                  message: expect.stringMatching(/No handler returned a response/i)
                })
              );
              return [3 /*break*/, 4];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    });
    it('should return a response when there are handlers and a response is returned asynchronously', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var router, res_1, error_3;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              expect.assertions(1);
              router = createMockRouter();
              router.use(function() {
                return Promise.resolve(res);
              });
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              return [4 /*yield*/, router.routeAsync(req, ctx)];
            case 2:
              res_1 = _a.sent();
              expect(res_1).toEqual(res_1);
              return [3 /*break*/, 4];
            case 3:
              error_3 = _a.sent();
              return [3 /*break*/, 4];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    });
    it('should return a response when there are handlers and a response is returned synchronously', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var router, res_2, error_4;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              expect.assertions(1);
              router = createMockRouter();
              router.use(function() {
                return res;
              });
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              return [4 /*yield*/, router.routeAsync(req, ctx)];
            case 2:
              res_2 = _a.sent();
              expect(res_2).toEqual(res_2);
              return [3 /*break*/, 4];
            case 3:
              error_4 = _a.sent();
              return [3 /*break*/, 4];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    });
    it('should normalise the request', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var req, router, res_3, error_5;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              expect.assertions(1);
              req = {method: 'PUT', uri: '/'};
              router = createMockRouter();
              router.put('/', function(req) {
                expect(req).toEqual({
                  version: '1.1',
                  method: 'put',
                  uri: '/',
                  query: {},
                  params: {},
                  headers: {},
                  body: undefined
                });
                return {};
              });
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              return [4 /*yield*/, router.routeAsync(req, ctx)];
            case 2:
              res_3 = _a.sent();
              return [3 /*break*/, 4];
            case 3:
              error_5 = _a.sent();
              return [3 /*break*/, 4];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    });
    it('should normalise the response', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var req, router, res_4, error_6;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              req = {method: 'PUT', uri: '/'};
              router = createMockRouter();
              router.put('/', function(req) {
                return {status: 201};
              });
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              return [4 /*yield*/, router.routeAsync(req, ctx)];
            case 2:
              res_4 = _a.sent();
              expect(res_4).toEqual({
                version: '1.1',
                status: 201,
                reason: 'Created',
                headers: {},
                body: undefined
              });
              return [3 /*break*/, 4];
            case 3:
              error_6 = _a.sent();
              return [3 /*break*/, 4];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    });
    it('should call the before callback', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var req, router;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              expect.assertions(1);
              req = {uri: '/'};
              router = createMockRouter();
              router.before(function(_a) {
                var req = _a.req;
                expect(req).toEqual({
                  version: '1.1',
                  method: 'GET',
                  uri: '/',
                  headers: {},
                  body: undefined
                });
              });
              router.get('/', {});
              return [4 /*yield*/, router.routeAsync(req, ctx)];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should call the after callback', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var req, router;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              expect.assertions(2);
              req = {uri: '/'};
              router = createMockRouter();
              router.after(function(_a) {
                var req = _a.req,
                  res = _a.res;
                expect(req).toEqual({
                  version: '1.1',
                  method: 'GET',
                  uri: '/',
                  headers: {},
                  body: undefined
                });
                expect(res).toEqual({
                  version: '1.1',
                  status: 201,
                  reason: 'Created',
                  headers: {},
                  body: undefined
                });
              });
              router.get('/', {status: 201});
              return [4 /*yield*/, router.routeAsync(req, ctx)];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should call the error callback', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var req, router, error_7;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              expect.assertions(2);
              req = {uri: '/'};
              router = createMockRouter();
              router.error(function(_a) {
                var req = _a.req,
                  err = _a.err;
                expect(req).toEqual({
                  version: '1.1',
                  method: 'GET',
                  uri: '/',
                  headers: {},
                  body: undefined
                });
                expect(err).toEqual(
                  expect.objectContaining({
                    message: expect.stringContaining('Oops')
                  })
                );
              });
              router.get('/', function() {
                return Promise.reject(new Error('Oops'));
              });
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              return [4 /*yield*/, router.routeAsync(req, ctx)];
            case 2:
              _a.sent();
              return [3 /*break*/, 4];
            case 3:
              error_7 = _a.sent();
              return [3 /*break*/, 4];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    });
  });
  it('should populate the request params', function() {
    var router = createMockRouter();
    router.get('/api/item/:id([0-9]+)', function(req) {
      expect(req.params).toEqual({
        id: '123'
      });
      return {};
    });
    router.routeSync({uri: '/api/item/123'}, ctx);
  });
  it('should clear the before callback');
  it('should clear the after callback');
  it('should clear the error callback');
  it('should clear the handlers');
});
