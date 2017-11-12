# xhr-mock

[![npm (tag)](https://img.shields.io/npm/v/xhr-mock/next.svg)]()
[![Build Status](https://travis-ci.org/jameslnewell/xhr-mock.svg?branch=master)](https://travis-ci.org/jameslnewell/xhr-mock)
[![npm](https://img.shields.io/npm/dm/localeval.svg)]()

Utility for mocking XMLHttpRequest.


## Installation

    npm install --save-dev xhr-mock

## Usage

`./createUser.js`
```js

// you could just as easily use Axios, jQuery, Superagent or another package here instead of using the native XMLHttpRequest object
export default function(data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status === 201) {
          resolve(JSON.parse(xhr.responseText).data);
        } else {
          reject(JSON.parse(xhr.responseText).error);
        }
      }
    }
    xhr.open('post', '/api/user');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({data: data}))
  });
}

```

`./createUser.test.js`
```js
import mock from 'xhr-mock';
import createUser from './createUser';

describe('createUser()', () => {

  // replace the real XHR object with the mock XHR object before each test
  beforeEach(() => mock.setup());
  
  // put the real XHR object back and clear the mocks after each test
  afterEach(() => mock.teardown());

  it('should send the data as JSON', () => {

    mock.post('/api/user', (req, res) => {
      expect(req.header('Content-Type')).to.equal('application/json');
      expect(req.body()).to.equal('{"foo":"bar"');
      return res;
    });

    return createUser({name: 'John'});
  });

  it('should resolve with some data when status=201', () => {

    mock.post('/api/user', {
      status: 201,
      reason: 'Created',
      body: '{"data":{"id":"abc-123"}}'
    });

    return expect(createUser({name: 'John'})).to.eventually.deep.equal({id: 'abc-123'});
  });

  it('should reject with an error when status=400', () => {

    mock.post('/api/user', {
      status: 400,
      reason: 'Bad Request',
      body: '{"error":"A user named \\"John\\" already exists."}'
    });

    return expect(createUser({name: 'John'})).to.be.rejectedWith(Error)
  });

});

```

## Examples

Examples of using `xhr-mock` with various frameworks:

- [Axios](example/src/axios/index.js)
- [Superagent](example/src/superagent/index.js)
- [jQuery](example/src/jquery/index.js)
- [XMLHttpRequest](example/src/native/index.js)

## API

### xhr-mock

#### .setup()

Replace the global `XMLHttpRequest` object with the `MockXMLHttpRequest`.

#### .teardown()

Restore the global `XMLHttpRequest` object to its original state.

#### .reset()

Forget all the request handlers.

#### .get(url | regex, mock)

Register a factory function to create mock responses for each GET request to a specific URL.

#### .post(url | regex, mock)

Register a factory function to create mock responses for each POST request to a specific URL.

#### .put(url | regex, mock)

Register a factory function to create mock responses for each PUT request to a specific URL.

#### .patch(url | regex, mock)

Register a factory function to create mock responses for each PATCH request to a specific URL.

#### .delete(url | regex, mock)

Register a factory function to create mock responses for each DELETE request to a specific URL.

#### .mock(method, url | regex, mock)

Register a factory function to create mock responses for each request to a specific URL.

#### .mock(fn)

Register a factory function to create mock responses for every request.

### MockXMLHttpRequest

### MockRequest

#### .method() : string

Get the request method.

#### .url() : MockURL

Get the request URL.

#### .header(name : string) : string | null

Get a request header.

#### .headers() : object

Get the request headers.

#### .body() : string

Get the request body.

### MockResponse

#### .status() : number

Get the response status.

#### .status(code : number)

Set the response status.

#### .reason() : string

Get the response reason.

#### .reason(phrase : string)

Set the response reason.

#### .header(name : string, value: string)

Set a response header.

#### .header(name : string) : string | null

Get a response header.

#### .headers() : object

Get the response headers.

#### .headers(headers : object)

Set the response headers.

#### .body() : string

Get the response body.

#### .body(body : string)

Set the response body.

## How to?

### Simulate progress

#### Upload progress

Set the `Content-Length` header and send a body. `xhr-mock` will emit `ProgressEvent`s.

```js
import mock from 'xhr-mock';

mock.setup();
mock.get('/', {});

const xhr = new XMLHttpRequest();
xhr.upload.onprogress = event => {
  console.log(event.loaded, event.total);
};
xhr.onloadend = event => {
  mock.teardown();
};
xhr.open('GET', '/');
xhr.setRequestHeader('Content-Type', '12');
xhr.send('Hello World!');
```

#### Download progress

Set the `Content-Length` header and send a body. `xhr-mock` will emit `ProgressEvent`s.

```js
import mock from 'xhr-mock';

mock.setup();
mock.get('/', {
  headers: {'Content-Type': '12'}
  body: 'Hello World!'
});

const xhr = new XMLHttpRequest();
xhr.onprogress = event => {
  console.log(event.loaded, event.total);
};
xhr.onloadend = event => {
  mock.teardown();
};
xhr.open('GET', '/');
xhr.send();
```


### Simulate a timeout

Return a `Promise` that never resolves or rejects.

```js
import mock from 'xhr-mock';

mock.post('/', (req, res) => {
  return new Promise(() => {});
});

const xhr = new XMLHttpRequest();
xhr.timeout = 100;
xhr.ontimeout = event => {
  console.log('timeout');
};
xhr.open('GET', '/');
xhr.send();

```

> A number of major libraries don't use the `timeout` event and use `setTimeout()` instead. Therefore, in order to mock timeouts in major libraries, we have to wait for the specified amount of time anyway.

### Simulate an error

Return a `Promise` that rejects.

```js
import mock from 'xhr-mock';

mock.post('/', (req, res) => {
  return new Promise.reject();
});

const xhr = new XMLHttpRequest();
xhr.onerror = event => {
  console.log(event.error);
};
xhr.open('GET', '/');
xhr.send();

```

### Proxying requests

If you want to mock some requests but not all of them, you can proxy unhandled requests to a real server.

```js
import mock from 'xhr-mock';

// mock specific requests
mock.post('/', (req, res) => {
  return res.status(204);
});

// other requests will be proxied to the actual server
mock.mock((req, res) => {
  return fetch(req.url(), {
    method: req.method(),
    headers: req.headers(),
    body: req.body()
  })
    .then(r => {
      return r.text().then(text => {
        return res
          .status(r.statusCode)
          .headers(r.headers.entries().reduce((headers, pair) => {
            headers[pair[0]] = pair[1];
          }))
          .body(text)
        ;
      });
    })
  ;
});
```
