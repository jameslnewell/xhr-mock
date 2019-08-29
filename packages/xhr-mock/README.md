# xhr-mock

[![npm (tag)](https://img.shields.io/npm/v/xhr-mock.svg)]()
[![Build Status](https://travis-ci.org/jameslnewell/xhr-mock.svg?branch=master)](https://travis-ci.org/jameslnewell/xhr-mock)
[![npm](https://img.shields.io/npm/dm/localeval.svg)]()

Utility for mocking `XMLHttpRequest`.

Great for testing. Great for prototyping while your backend is still being built.

Works in NodeJS and in the browser. Is compatible with [Axios](https://www.npmjs.com/package/axios), [jQuery](https://www.npmjs.com/package/jquery), [Superagent](https://www.npmjs.com/package/superagent)
and probably every other library built on `XMLHttpRequest`. Standard compliant ([http://xhr.spec.whatwg.org/](http://xhr.spec.whatwg.org/)).

###### Documentation

* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
* [How to?](#how-to)

## <a name="installation">Installation</a>

### Using a bundler

If you are using a bundler like [Webpack](https://www.npmjs.com/package/webpack) or [Browserify](https://www.npmjs.com/package/browserify) then install `xhr-mock` using `yarn` or `npm`:

```bash
yarn add --dev xhr-mock
```

Now import `xhr-mock` and start using it in your scripts:

```js
import mock from 'xhr-mock';
```

### Without a bundler

If you aren't using a bundler like [Webpack](https://www.npmjs.com/package/webpack) or [Browserify](https://www.npmjs.com/package/browserify) then add this script to your HTML:

```html
<script src="https://unpkg.com/xhr-mock/dist/xhr-mock.js"></script>
```

Now you can start using the global, `XHRMock`, in your scripts.

## <a name="usage">Usage</a>

First off lets write some code that uses `XMLHttpRequest`...

`./createUser.js`

```js
// we could have just as easily use Axios, jQuery, Superagent
// or another package here instead of using the native XMLHttpRequest object

export default function(data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status === 201) {
          try {
            resolve(JSON.parse(xhr.responseText).data);
          } catch (error) {
            reject(error);
          }
        } else if (xhr.status) {
          try {
            reject(JSON.parse(xhr.responseText).error);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error('An error ocurred whilst sending the request.'));
        }
      }
    };
    xhr.open('post', '/api/user');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({data: data}));
  });
}
```

Now lets test the code we've written...

`./createUser.test.js`

```js
import mock from 'xhr-mock';
import createUser from './createUser';

describe('createUser()', () => {
  // replace the real XHR object with the mock XHR object before each test
  beforeEach(() => mock.setup());

  // put the real XHR object back and clear the mocks after each test
  afterEach(() => mock.teardown());

  it('should send the data as JSON', async () => {
    expect.assertions(2);

    mock.post('/api/user', (req, res) => {
      expect(req.header('Content-Type')).toEqual('application/json');
      expect(req.body()).toEqual('{"data":{"name":"John"}}');
      return res.status(201).body('{"data":{"id":"abc-123"}}');
    });

    await createUser({name: 'John'});
  });

  it('should resolve with some data when status=201', async () => {
    expect.assertions(1);

    mock.post('/api/user', {
      status: 201,
      reason: 'Created',
      body: '{"data":{"id":"abc-123"}}'
    });

    const user = await createUser({name: 'John'});

    expect(user).toEqual({id: 'abc-123'});
  });

  it('should reject with an error when status=400', async () => {
    expect.assertions(1);

    mock.post('/api/user', {
      status: 400,
      reason: 'Bad request',
      body: '{"error":"A user named \\"John\\" already exists."}'
    });

    try {
      const user = await createUser({name: 'John'});
    } catch (error) {
      expect(error).toMatch('A user named "John" already exists.');
    }
  });
});
```

## <a name="api">API</a>

### xhr-mock

#### .setup()

Replace the global `XMLHttpRequest` object with the `MockXMLHttpRequest`.

#### .teardown()

Restore the global `XMLHttpRequest` object to its original state.

#### .reset()

Forget all the request handlers.

#### .get(url | regex, mock)

Register a factory function to create mock responses for each GET request to a specific URL.

```js
mock.get(/\.*.json$/, {
  body: JSON.stringify({ data: { id: "abc" } })
});
```

#### .post(url | regex, mock)

Register a factory function to create mock responses for each POST request to a specific URL.

#### .put(url | regex, mock)

Register a factory function to create mock responses for each PUT request to a specific URL.

#### .patch(url | regex, mock)

Register a factory function to create mock responses for each PATCH request to a specific URL.

#### .delete(url | regex, mock)

Register a factory function to create mock responses for each DELETE request to a specific URL.

#### .use(method, url | regex, mock)

Register a factory function to create mock responses for each request to a specific URL.

#### .use(fn)

Register a factory function to create mock responses for every request.

#### .error(fn)

Log errors thrown by handlers.

### MockXMLHttpRequest

### MockRequest

#### .method() : string

Get the request method.

#### .url() : MockURL

Get the request URL.

#### .header(name : string, value: string)

Set a request header.

#### .header(name : string) : string | null

Get a request header.

#### .headers() : object

Get the request headers.

#### .headers(headers : object)

Set the request headers.

#### .body() : string

Get the request body.

#### .body(body : string)

Set the request body.

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

## <a name="how-to">How to?</a>

### Simulate progress

#### Upload progress

Set the `Content-Length` header and send a body. `xhr-mock` will emit `ProgressEvent`s.

```js
import mock from 'xhr-mock';

mock.setup();

mock.post('/', {});

const xhr = new XMLHttpRequest();
xhr.upload.onprogress = event => console.log(event.loaded, event.total);
xhr.open('POST', '/');
xhr.setRequestHeader('Content-Length', '12');
xhr.send('Hello World!');
```

#### Download progress

Set the `Content-Length` header and send a body. `xhr-mock` will emit `ProgressEvent`s.

```js
import mock from 'xhr-mock';

mock.setup();

mock.get('/', {
  headers: {'Content-Length': '12'},
  body: 'Hello World!'
});

const xhr = new XMLHttpRequest();
xhr.onprogress = event => console.log(event.loaded, event.total);
xhr.open('GET', '/');
xhr.send();
```

### Simulate a timeout

Return a `Promise` that never resolves or rejects.

```js
import mock from 'xhr-mock';

mock.setup();

mock.get('/', () => new Promise(() => {}));

const xhr = new XMLHttpRequest();
xhr.timeout = 100;
xhr.ontimeout = event => console.log('timeout');
xhr.open('GET', '/');
xhr.send();
```

> A number of major libraries don't use the `timeout` event and use `setTimeout()` instead. Therefore, in order to mock timeouts in major libraries, we have to wait for the specified amount of time anyway.

### Simulate an error

Return a `Promise` that rejects. If you want to test a particular error you an use one of the pre-defined error classes.

```js
import mock from 'xhr-mock';

mock.setup();

mock.get('/', () => Promise.reject(new Error()));

const xhr = new XMLHttpRequest();
xhr.onerror = event => console.log('error');
xhr.open('GET', '/');
xhr.send();
```

### Proxying requests

If you want to mock some requests, but not all of them, you can proxy unhandled requests to a real server.

```js
import mock, {proxy} from 'xhr-mock';

mock.setup();

// mock specific requests
mock.post('/', {status: 204});

// proxy unhandled requests to the real servers
mock.use(proxy);

// this request will receive a mocked response
const xhr1 = new XMLHttpRequest();
xhr1.open('POST', '/');
xhr1.send();

// this request will receieve the real response
const xhr2 = new XMLHttpRequest();
xhr2.open('GET', 'https://jsonplaceholder.typicode.com/users/1');
xhr2.send();
```

### Delaying requests

Requests can be delayed using our handy `delay` utility.

```js
import mock, {delay} from 'xhr-mock';

mock.setup();

// delay the request for three seconds
mock.post('/', delay({status: 201}, 3000));
```

### Once off requests

Requests can be made on one off occasions using our handy `once` utility.

```js
import mock, {once} from 'xhr-mock';

mock.setup();

// the response will only be returned the first time a request is made
mock.post('/', once({status: 201}));
```

### send a sequence of responses

In case you need to return a different response each time a request is made, you may use the `sequence` utility.

```js
import mock, {sequence} from 'xhr-mock';

mock.setup();

mock.post('/', sequence([
  {status: 200}, // the first request will receive a response with status 200
  {status: 500}  // the second request will receive a response with status 500
                 // if a third request is made, no response will be sent
  ]
));
```

## License

MIT Licensed. Copyright (c) James Newell 2014.
