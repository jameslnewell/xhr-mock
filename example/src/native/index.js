var mock = require('xhr-mock');
mock.setup();

mock.get('http://google.com/', function(req, res) {
  return res.status(200).body('<h1>Google</h1>');
});

// ---------

var xhr = new XMLHttpRequest();

xhr.open('GET', 'http://google.com/');

xhr.onload = function() {
  console.log('loaded', this.responseText);
};

xhr.onerror = function() {
  console.log('error');
};

xhr.send();

// ---------
