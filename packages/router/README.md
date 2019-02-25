# @xhr-mock/router

[![Build Status](https://travis-ci.org/jameslnewell/xhr-mock.svg?branch=master)](https://travis-ci.org/jameslnewell/xhr-mock)

A router for dispatching requests and responses.

## Installation

```bash
yarn add @xhr-mock/router
```

## Usage

```js
import Router, {Mode} from '@xhr-mock/router';

const router = new Router().get('/', {status: 200, body: 'Hello World!'}).use(req => ({
  status: 200,
  body: JSON.stringify(req)
}));
const response = router.handle(
  Mode.SYNC,
  {
    method: 'get',
    uri: '/foo/bar'
  },
  {}
);
```

> Depending on your runtime environment you may require a polyfill for `URL` e.g. `url-polyfill`.

## API

### `new Router()`

### `.on(event, listener)`

### `.off(event, listener)`

### `.use(middleware)`

### `.use(method, url, response)`

### `.use(method, url, middleware)`

### `.get(url, response)`

### `.get(url, middleware)`

### `.post(url, response)`

### `.post(url, middleware)`

### `.put(url, response)`

### `.put(url, middleware)`

### `.delete(url, response)`

### `.delete(url, middleware)`

### `.handle(mode, request, response)`

## License

MIT Licensed. Copyright (c) James Newell 2014.
