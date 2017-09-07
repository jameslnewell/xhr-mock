import $ from 'jquery';
import mock from 'xhr-mock';

mock.setup();

mock.get('http://google.com/', {
  body: '<h1>Google</h1>'
});

// ---------

$.get('http://google.com/', (data, textStatus, jqXHR) => {
  console.log('loaded', data);
}).fail(() => {
  console.log('ERROR', arguments);
});

// ---------
