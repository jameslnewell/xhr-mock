'use strict';
exports.__esModule = true;
var chai_1 = require('chai');
var ajax_1 = require('rxjs/observable/dom/ajax');
var xhr_mock_1 = require('xhr-mock');
describe('rxjs', function() {
  beforeEach(function() {
    return xhr_mock_1['default'].setup();
  });
  afterEach(function() {
    return xhr_mock_1['default'].teardown();
  });
  it('should return a JSON object', function(done) {
    xhr_mock_1['default'].post('/some-url', {
      body: JSON.stringify({data: 'mockdata'})
    });
    ajax_1
      .ajax({
        url: '/some-url',
        body: {some: 'something'},
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'json'
      })
      .subscribe({
        next: function(response) {
          try {
            chai_1.expect(response.response).to.be.deep.equal({
              data: 'mockdata'
            });
          } catch (error) {
            done(error);
          }
        },
        error: function(error) {
          return done(error);
        },
        complete: function() {
          return done();
        }
      });
  });
});
