import mock, {proxy} from 'xhr-mock';

mock.setup();

mock.get('http://localhost/api/speak', {
  body: JSON.stringify({message: 'Hello World!'})
});

mock.use(proxy);

// ---------

function fetch(url) {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url);

  xhr.onload = function() {
    console.log(`loaded ${url}:`, this.responseText);
  };

  xhr.onerror = function() {
    console.log(`error loading ${url}`);
  };

  xhr.send();
}

fetch('http://localhost/api/speak');
fetch('https://jsonplaceholder.typicode.com/users/1');

// ---------
