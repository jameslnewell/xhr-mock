# xhr-mock

[![npm (tag)](https://img.shields.io/npm/v/xhr-mock/next.svg)]()
[![Build Status](https://travis-ci.org/jameslnewell/xhr-mock.svg?branch=master)](https://travis-ci.org/jameslnewell/xhr-mock)
[![npm](https://img.shields.io/npm/dm/localeval.svg)]()

Utility for mocking XMLHttpRequests in the browser.

Useful for unit testing and doesn't require you to inject a mocked object into your code.

## Installation

    npm install --save-dev xhr-mock

## Usage

```javascript
import mock from 'xhr-mock';

// replace the real XHR object with the mock XHR object
mock.setup();

// mock object
mock.get('http://localhost/index.html', {
  status: 200,
  reason: 'OK',
  headers: {
    'Content-Type': 'text/html'
  },
  body: '<h1>Hello World!</h1>'
});

// mock function
mock.get(/api\/user/, (req, res) => {
  return res
    .status(201)
    .header('Content-Type', 'application/json')
    .body(JSON.stringify({
      first_name: 'John', 
      last_name: 'Smith'
    }))
  ;
});

// create an instance of the mock XHR object and use as usual
const xhr = new XMLHttpRequest();
...

xhr.onreadystatechange = () => {
  if (xhr.readyState == 4) {

    // when you're finished put the real XHR object back
    mock.teardown();

  }
}
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

#### .url() : URL

Get the request URL.

#### .query() : object

Get the parsed query part of the request URL.

#### .header(name : string) : string | null

Get a request header.

#### .headers() : object

Get the request headers.

#### .body() : string

Get the request body.

#### .progress(loaded : number, total : number, lengthComputable : bool)

Dispatch a progress event on the upload object. Pass in loaded size, total size and if event is lengthComputable.

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

#### .progress(loaded : number, total : number, lengthComputable : bool)

Dispatch a progress event. Pass in loaded size, total size and if event is lengthComputable.

## How to?

### Simulate a timeout

Return a `Promise` that never resolves.

```js
import mock from 'xhr-mock';

mock.post('http://localhost/foo/bar', (req, res) => {
  return new Promise(() => {});
});
```

> A number of major libraries don't use the `timeout` event and use `setTimeout()` instead. Therefore, in order to mock timeouts in major libraries, we have to wait for the specified amount of time anyway.

### Simulate an error

Return a `Promise` that rejects.

```js
import mock from 'xhr-mock';

mock.post('http://localhost/foo/bar', (req, res) => {
  return new Promise.reject();
});
```

### Proxy requests

If you want to mock some requests but not all of them, you can proxy unhandled requests to a real server.

```js
import mock from 'xhr-mock';

// mock specific requests
mock.post('http://localhost/foo/bar', (req, res) => {
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
