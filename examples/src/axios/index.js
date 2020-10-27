import mock from 'xhr-mock';
import axios from 'axios';

mock.setup();

mock.get('http://google.com/', {
  body: '<h1>Google</h1>',
});

// ---------

axios.get('http://google.com/').then(
  (res) => {
    console.log('loaded', res.data);
  },
  (error) => {
    console.log('ERROR', error);
  },
);

// ---------
