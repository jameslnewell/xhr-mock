import mock from 'xhr-mock';

mock.setup();

mock.get('http://google.com/', {
  body: '<h1>Google</h1>'
});

// ---------

const xhr = new XMLHttpRequest();

xhr.open('GET', 'http://google.com/');

xhr.onload = function() {
  console.log('loaded', this.responseText);
};

xhr.onerror = function() {
  console.log('error');
};

xhr.send();

// ---------
