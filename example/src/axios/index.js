var mock = require('xhr-mock');
mock.setup();

mock.get('http://google.com/', function(req, res) {
  return res.status(200).body('<h1>Google</h1>');
});

// ---------

var axios = require('axios');
axios.get('http://google.com/').then(
  function(res) {
    console.log('loaded', res.data);
  },
  function(error) {
    console.log('ERROR', error);
  }
);

// ---------
