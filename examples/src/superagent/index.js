import mock from 'xhr-mock';
import superagent from 'superagent';

mock.setup();

mock.get('http://google.com/', {
  body: '<h1>Google</h1>',
});

// ---------

superagent.get('http://google.com/', (err, res) => {
  if (err) return console.log('ERROR', arguments);
  console.log('loaded', res.text);
});

// ---------
