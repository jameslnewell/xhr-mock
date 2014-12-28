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




});