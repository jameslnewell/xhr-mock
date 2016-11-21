# xhr-mock

[![Build Status](https://travis-ci.org/jameslnewell/xhr-mock.svg?branch=master)](https://travis-ci.org/jameslnewell/xhr-mock)

Utility for mocking XMLHttpRequests in the browser.

Useful for unit testing and doesn't require you to inject a mocked object into your code.

## Installation

### Browserify

    npm install --save xhr-mock

### Component

    component install jameslnewell/xhr-mock

## Usage

```javascript
var mock = require('xhr-mock');

//replace the real XHR object with the mock XHR object
mock.setup();

//create a mock response for all POST requests with the URL http://localhost/api/user
mock.post('http://localhost/api/user', function(req, res) {

  //return null;              //simulate an error
  //return res.timeout(true); //simulate a timeout

  return res
    .status(201)
    .header('Content-Type', 'application/json')
    .body(JSON.stringify({data: {
      first_name: 'John', last_name: 'Smith'
    }}))
  ;

});

//create an instance of the (mock) XHR object and use as per normal
var xhr = new XMLHttpRequest();
...

xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {

    //when you're finished put the real XHR object back
    mock.teardown();

  }
}
```

## Examples

Examples of using `xhr-mock` with various frameworks:

- [Superagent](./example/superagent.html)
- [jQuery](./example/jquery.html)
- [XMLHttpRequest](./example/native.html)

## API

### xhr-mock

#### .setup()

Replace the global `XMLHttpRequest` object with the `MockXMLHttpRequest`.

#### .teardown()

Restore the global `XMLHttpRequest` object to its original state.

#### .get(url, fn)

Register a factory function to create mock responses for each GET request to a specific URL.

#### .post(url, fn)

Register a factory function to create mock responses for each POST request to a specific URL.

#### .put(url, fn)

Register a factory function to create mock responses for each PUT request to a specific URL.

#### .patch(url, fn)

Register a factory function to create mock responses for each PATCH request to a specific URL.

#### .delete(url, fn)

Register a factory function to create mock responses for each DELETE request to a specific URL.

#### .mock(method, url, fn)

Register a factory function to create mock responses for each request to a specific URL.

#### .mock(fn)

Register a factory function to create mock responses for every request.

### MockXMLHttpRequest

### MockRequest

#### .method() : string

Get the request method.

#### .url() : string

Get the request URL.

#### .header(name : string) : string

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

#### .header(name : string, value: string)

Set a response header.

#### .header(name : string) : string

Get a response header.

#### .headers() : object

Get the response headers.

#### .headers(headers : object)

Set the response headers.

#### .body() : string

Get the response body.

#### .body(body : string)

Set the response body.

#### .timeout() : bool|number

Get whether the response will trigger a time out.

#### .timeout(timeout : bool|number)

Set whether the response will trigger a time out. `timeout` defaults to the value set on the XHR object.

#### .progress(loaded : number, total : number, lengthComputable : bool)

Trigger progress event. Pass in loaded size, total size and if event is lengthComputable.

## Change log
### 1.7.0

- added support for `addEventListener` ([#15](https://github.com/jameslnewell/xhr-mock/pull/15))

## ToDo

- Ability to return mocked responses asynchronously
- Ability to provide a simple object response instead of a function
- Handle JSON and XML response types
