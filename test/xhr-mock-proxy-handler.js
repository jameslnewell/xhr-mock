var assert              = require('assert');
var Promise             = require('lie');
var xhrMockProxyHandler = require('../lib/xhr-mock-proxy-handler');
var MockRequest         = require('../lib/MockRequest');
var MockResponse        = require('../lib/MockResponse');

describe('xhr-mock-proxy-handler', function() {    

    it('returns Promise', function() {
        var xhr = {
            method: 'GET',
            url: '/',
            _requestedHeaders: '',
            body: undefined
        }

        var request = new MockRequest(xhr);
        var response = new MockResponse();

        var result = xhrMockProxyHandler(request, response);
        assert.ok(result instanceof Promise)
    });

    it('returns Promise that will be resolved', function(done) {
        var xhr = {
            method: 'GET',
            url: '/',
            _requestedHeaders: '',
            body: undefined
        }

        var request = new MockRequest(xhr);
        var response = new MockResponse();


        xhrMockProxyHandler(request, response).then(function (response) {
            assert.equal(response.status(), 200);
            assert.equal(typeof response.body(), 'string');
            assert.ok(response.body.length > 0);
            assert.notEqual(response.headers(), {})

            done();
        });
    });

    it('returns Promise that will be rejected', function(done) {
        var xhr = {
            method: 'GET',
            url: '/not-existent-route',
            _requestedHeaders: '',
            body: undefined
        }

        var request = new MockRequest(xhr);
        var response = new MockResponse();

        xhrMockProxyHandler(request, response).catch(function (err) {            
            done();
        });
    });
});
