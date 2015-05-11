var assert  = require('assert');
var mock    = require('xhr-mock');

describe('xhr-mock', function() {

	describe('.setup() and teardown()', function() {

		it('should setup and teardown the mock XMLHttpRequest class', function() {

			var xhr = window.XMLHttpRequest;
			mock.setup();
			assert.notEqual(window.XMLHttpRequest, xhr);
			mock.teardown();
			assert.equal(window.XMLHttpRequest, xhr);

		});

		it('should remove any handlers', function() {

			mock.get('http://www.google.com/', function() {});
			mock.setup();
			assert.equal(mock.XMLHttpRequest.handlers.length, 0);
			mock.get('http://www.google.com/', function() {});
			mock.teardown();
			assert.equal(mock.XMLHttpRequest.handlers.length, 0);

		});

	});

	describe('.setRequestHeader()', function() {

		beforeEach(function() {
			mock.setup();
		});

		afterEach(function() {
			mock.teardown();
		});

		it('should set a header', function(done) {

			mock.mock(function(req, res) {
				assert.equal(req.header('content-type'), 'application/json');
				done();
			});

			var xhr = new XMLHttpRequest();
			xhr.open('/');
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send();

		});

	})

});