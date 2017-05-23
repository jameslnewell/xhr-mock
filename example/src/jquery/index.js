var $ = require('jquery');
var mock = require('xhr-mock');
mock.setup();

mock.get('http://google.com/', function(req, res) {
  return res.status(200).body('<h1>Google</h1>');
});

// ---------

$.get('http://google.com/', function(data, textStatus, jqXHR) {
  console.log('loaded', data);
}).fail(function() {
  console.log('ERROR', arguments);
});

// ---------
