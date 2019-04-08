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
var chai_1 = require('chai');
var $ = require('jquery');
var xhr_mock_1 = require('xhr-mock');
describe('jquery', function() {
  beforeEach(function() {
    return xhr_mock_1['default'].setup();
  });
  afterEach(function() {
    return xhr_mock_1['default'].teardown();
  });
  it('should GET', function() {
    return __awaiter(_this, void 0, void 0, function() {
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            xhr_mock_1['default'].use(function(req, res) {
              chai_1.expect(req.method()).to.eq('GET');
              chai_1.expect(String(req.url())).to.eq('/');
              chai_1.expect(req.body()).to.eq(null);
              return res
                .status(200)
                .reason('OK')
                .header('Content-Length', '12')
                .body('Hello World!');
            });
            return [
              4 /*yield*/,
              $.ajax('/')
                .then(function(data, status, xhr) {
                  chai_1.expect(xhr.status).to.eq(200);
                  chai_1.expect(xhr.statusText).to.eq('OK');
                  chai_1.expect(xhr.getAllResponseHeaders()).to.contain('content-length: 12\r\n');
                  chai_1.expect(data).to.eq('Hello World!');
                })
                ['catch'](function(xhr, status, error) {
                  return chai_1.expect.fail(error);
                })
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('should POST', function() {
    return __awaiter(_this, void 0, void 0, function() {
      var res;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            xhr_mock_1['default'].use(function(req, res) {
              chai_1.expect(req.method()).to.eq('POST');
              chai_1.expect(String(req.url())).to.eq('/');
              chai_1.expect(req.body()).to.eq(JSON.stringify({foo: 'bar'}));
              return res
                .status(201)
                .reason('Created')
                .header('Content-Length', '12')
                .body('Hello World!');
            });
            return [
              4 /*yield*/,
              $.ajax({
                method: 'post',
                url: '/',
                data: JSON.stringify({foo: 'bar'})
              })
                .then(function(data, status, xhr) {
                  chai_1.expect(xhr.status).to.eq(201);
                  chai_1.expect(xhr.statusText).to.eq('Created');
                  chai_1.expect(xhr.getAllResponseHeaders()).to.contain('content-length: 12\r\n');
                  chai_1.expect(data).to.eq('Hello World!');
                })
                ['catch'](function(xhr, status, error) {
                  return chai_1.expect.fail(error);
                })
            ];
          case 1:
            res = _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('should PUT', function() {
    return __awaiter(_this, void 0, void 0, function() {
      var res;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            xhr_mock_1['default'].use(function(req, res) {
              chai_1.expect(req.method()).to.eq('PUT');
              chai_1.expect(String(req.url())).to.eq('/');
              chai_1.expect(req.body()).to.eq(JSON.stringify({foo: 'bar'}));
              return res
                .status(200)
                .reason('OK')
                .header('Content-Length', '12')
                .body('Hello World!');
            });
            return [
              4 /*yield*/,
              $.ajax({
                method: 'put',
                url: '/',
                data: JSON.stringify({foo: 'bar'})
              })
                .then(function(data, status, xhr) {
                  chai_1.expect(xhr.status).to.eq(200);
                  chai_1.expect(xhr.statusText).to.eq('OK');
                  chai_1.expect(xhr.getAllResponseHeaders()).to.contain('content-length: 12\r\n');
                  chai_1.expect(data).to.eq('Hello World!');
                })
                ['catch'](function(xhr, status, error) {
                  return chai_1.expect.fail(error);
                })
            ];
          case 1:
            res = _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('should DELETE', function() {
    return __awaiter(_this, void 0, void 0, function() {
      var res;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            xhr_mock_1['default'].use(function(req, res) {
              chai_1.expect(req.method()).to.eq('DELETE');
              chai_1.expect(String(req.url())).to.eq('/');
              chai_1.expect(req.body()).to.eq(null);
              return res.status(204).reason('No Content');
            });
            return [
              4 /*yield*/,
              $.ajax({
                method: 'delete',
                url: '/'
              })
                .then(function(data, status, xhr) {
                  chai_1.expect(xhr.status).to.eq(204);
                  chai_1.expect(xhr.statusText).to.eq('No Content');
                  chai_1.expect(xhr.getAllResponseHeaders()).to.eq('');
                  chai_1.expect(data).to.eq(undefined);
                })
                ['catch'](function(xhr, status, error) {
                  return chai_1.expect.fail(error);
                })
            ];
          case 1:
            res = _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('should time out', function() {
    return __awaiter(_this, void 0, void 0, function() {
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            xhr_mock_1['default'].get('/', function() {
              return new Promise(function() {});
            });
            return [
              4 /*yield*/,
              $.ajax({
                url: '/',
                timeout: 10
              }).then(
                function() {
                  return chai_1.expect.fail();
                },
                function(xhr, status, error) {
                  chai_1.expect(status).to.eq('timeout');
                  chai_1.expect(error).to.contain('');
                }
              )
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('should error', function() {
    return __awaiter(_this, void 0, void 0, function() {
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            xhr_mock_1['default'].get('/', function() {
              return Promise.reject(new Error('😬'));
            });
            return [
              4 /*yield*/,
              $.ajax('/').then(
                function() {
                  return chai_1.expect.fail();
                },
                function(xhr, status, error) {
                  chai_1.expect(status).to.eq('error');
                  chai_1.expect(error).to.contain('');
                }
              )
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
});
