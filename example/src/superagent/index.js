import mock from 'xhr-mock';

mock.setup();

mock.get('http://google.com/', function(req, res) {
  return res.status(200).body('<h1>Google</h1>');
});

// ---------

const superagent = require('superagent');
superagent.get('http://google.com/', function(err, res) {
  if (err) return console.log('ERROR', arguments);
  console.log('loaded', res.text);
});

// ---------
