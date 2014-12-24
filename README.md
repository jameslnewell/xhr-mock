# xhr-mock

A utility for mocking XMLHttpRequests in the browser. Useful for unit testing. Doesn't require you to change your code.

## Installation

    component install jameslnewell/xhr-mock

## Usage

    var mock = require('xhr-mock');

    //replace the real XHR object with the mock XHR object
    mock.setup();

    //mock up a response
    mock.get('http://google.com/', function(request) {
        request.status          = 200;
        request.responseText    = '<h1>Hello World</h1>';
    });

    //create an instance of the (mock) XHR object and use as per normal
    var xhr = new XMLHttpRequest();
    ...

    //when you're finished put the real XHR object back
    mock.teardown();

## API

### Mock.setup()

### Mock.teardown()

### Mock.mock(fn)
### Mock.mock(method, url, fn)

### Mock.get(url, fn)
### Mock.post(url, fn)
### Mock.put(url, fn)
### Mock.delete(url, fn)