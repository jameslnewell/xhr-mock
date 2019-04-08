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
exports.__esModule = true;
var MockError_1 = require('../MockError');
var createHandler_1 = require('./createHandler');
var isPromise_1 = require('./isPromise');
var formatMessage_1 = require('./formatMessage');
var normalise_1 = require('./normalise');
function afterLogger(event) {
  var req = event.req,
    res = event.res;
  console.info(formatMessage_1.formatMessage('A handler returned a response for the request.', {req: req, res: res}));
}
function errorLogger(event) {
  var req = event.req,
    err = event.err;
  if (err instanceof MockError_1.MockError) {
    console.error(formatMessage_1.formatMessage(err.message, {req: req}));
  } else {
    console.error(formatMessage_1.formatMessage('A handler returned an error for the request.', {req: req, err: err}));
  }
}
var MockRouter = /** @class */ (function() {
  function MockRouter() {
    this.afterHandlerCallback = afterLogger;
    this.handlerErrorCallback = errorLogger;
    this.handlers = [];
  }
  MockRouter.prototype.clear = function() {
    this.handlers = [];
    this.beforeHandlerCallback = undefined;
    this.afterHandlerCallback = afterLogger;
    this.handlerErrorCallback = errorLogger;
    return this;
  };
  MockRouter.prototype.before = function(callback) {
    this.beforeHandlerCallback = callback;
    return this;
  };
  MockRouter.prototype.after = function(callback) {
    this.afterHandlerCallback = callback;
    return this;
  };
  MockRouter.prototype.error = function(callback) {
    this.handlerErrorCallback = callback;
    return this;
  };
  MockRouter.prototype.use = function(methodOrHandler, uri, handlerOrResponse) {
    if (typeof methodOrHandler === 'function' && !uri && !handlerOrResponse) {
      this.handlers.push(methodOrHandler);
    } else if (typeof methodOrHandler === 'string' && uri && handlerOrResponse) {
      this.handlers.push(createHandler_1.createHandler(methodOrHandler, uri, handlerOrResponse));
    } else {
      throw new MockError_1.MockError('Invalid parameters.');
    }
    return this;
  };
  MockRouter.prototype.get = function(uri, handlerOrResponse) {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof handlerOrResponse === 'function') {
      this.use('get', uri, handlerOrResponse);
    } else {
      this.use('get', uri, handlerOrResponse);
    }
    return this;
  };
  MockRouter.prototype.post = function(uri, handlerOrResponse) {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof handlerOrResponse === 'function') {
      this.use('post', uri, handlerOrResponse);
    } else {
      this.use('post', uri, handlerOrResponse);
    }
    return this;
  };
  MockRouter.prototype.put = function(uri, handlerOrResponse) {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof handlerOrResponse === 'function') {
      this.use('put', uri, handlerOrResponse);
    } else {
      this.use('put', uri, handlerOrResponse);
    }
    return this;
  };
  MockRouter.prototype.patch = function(uri, handlerOrResponse) {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof handlerOrResponse === 'function') {
      this.use('patch', uri, handlerOrResponse);
    } else {
      this.use('patch', uri, handlerOrResponse);
    }
    return this;
  };
  MockRouter.prototype['delete'] = function(uri, handlerOrResponse) {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof handlerOrResponse === 'function') {
      this.use('delete', uri, handlerOrResponse);
    } else {
      this.use('delete', uri, handlerOrResponse);
    }
    return this;
  };
  MockRouter.prototype.routeSync = function(req, ctx) {
    var fullRequest = normalise_1.normaliseRequest(req);
    var fullContext = __assign({}, ctx, {sync: true});
    if (this.beforeHandlerCallback) {
      this.beforeHandlerCallback({req: fullRequest, ctx: fullContext});
    }
    try {
      for (var i = 0; i < this.handlers.length; ++i) {
        var res = this.handlers[i](fullRequest, fullContext);
        if (!res) {
          continue;
        }
        if (isPromise_1.isPromise(res)) {
          throw new MockError_1.MockError(
            'A handler returned a response asynchronously while the request is being routed synchronously.'
          );
        }
        var fullResponse = normalise_1.normaliseResponse(res);
        if (this.afterHandlerCallback) {
          this.afterHandlerCallback({
            req: fullRequest,
            res: fullResponse,
            ctx: fullContext
          });
        }
        return fullResponse;
      }
      throw new MockError_1.MockError('No handler returned a response for the request.');
    } catch (err) {
      if (this.handlerErrorCallback) {
        this.handlerErrorCallback({
          req: fullRequest,
          err: err,
          ctx: fullContext
        });
      }
      throw err;
    }
  };
  MockRouter.prototype.routeAsync = function(req, ctx) {
    return __awaiter(this, void 0, void 0, function() {
      var fullRequest, fullContext, res, fullResponse, err_1;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            fullRequest = normalise_1.normaliseRequest(req);
            fullContext = __assign({}, ctx, {sync: false});
            if (this.beforeHandlerCallback) {
              this.beforeHandlerCallback({req: fullRequest, ctx: fullContext});
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [
              4 /*yield*/,
              this.handlers.reduce(function(promise, handler) {
                return promise.then(function(res) {
                  if (res) {
                    return res;
                  } else {
                    return handler(fullRequest, fullContext);
                  }
                });
              }, Promise.resolve(undefined))
            ];
          case 2:
            res = _a.sent();
            if (res) {
              fullResponse = normalise_1.normaliseResponse(res);
              if (this.afterHandlerCallback) {
                this.afterHandlerCallback({
                  req: fullRequest,
                  res: fullResponse,
                  ctx: fullContext
                });
              }
              return [2 /*return*/, fullResponse];
            } else {
              throw new MockError_1.MockError('No handler returned a response for the request.');
            }
            return [3 /*break*/, 4];
          case 3:
            err_1 = _a.sent();
            if (this.handlerErrorCallback) {
              this.handlerErrorCallback({req: fullRequest, err: err_1, ctx: fullContext});
            }
            throw err_1;
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  return MockRouter;
})();
exports.MockRouter = MockRouter;
