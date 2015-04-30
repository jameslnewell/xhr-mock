# xhr-mock

A utility for mocking XMLHttpRequests in the browser. Useful for unit testing and doesn't require changes to your code.

## Installation

### Browserify

    npm install --save xhr-mock

### Component

    component install jameslnewell/xhr-mock

## Usage

    var mock = require('xhr-mock');

    //replace the real XHR object with the mock XHR object
    mock.setup();

    //create a mock response for all GET requests to http://google.com/
    mock.get('http://google.com/', function(req, res) {
        return res
            .status(200)
            .body('<h1>Google</h1>')
        ;
    });

    //create an instance of the (mock) XHR object and use as per normal
    var xhr = new XMLHttpRequest();
    ...

    //when you're finished put the real XHR object back
    mock.teardown();

## Examples

Examples of xhr-mock working with various frameworks:

- [Superagent](./example/superagent.html)
- [jQuery](./example/jquery.html)
- [XMLHttpRequest](./example/native.html)

***note:*** requires building with browserify or component first.

## API

### Mock.setup()

Replace the native XHR object with a mock one.

### Mock.teardown()

Restore the native XHR object.

### Mock.mock(fn)

Register a mock response for all requests.

### Mock.get(url, fn)

Register a mock response for all GET requests to a URL.

### Mock.post(url, fn)

Register a mock response for all POST requests to a URL.

### Mock.put(url, fn)

Register a mock response for all PUT requests to a URL.

### Mock.delete(url, fn)

Register a mock response for all DELETE requests to a URL.

### Mock.mock(method, url, fn)

Register a mock response for all requests to a URL.

## ToDo

- Ability to return mocked responses asynchronously
- Ability to provide a simple object response instead of a function