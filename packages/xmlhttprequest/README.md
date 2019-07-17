# @xhr-mock/xmlhtprequest

[![Build Status](https://travis-ci.org/jameslnewell/xhr-mock.svg?branch=master)](https://travis-ci.org/jameslnewell/xhr-mock)

A mock for XMLHttpRequest.

> Attempts to adhere to https://xhr.spec.whatwg.org/

## Installation

```bash
yarn add @xhr-mock/xmlhttprequest
```

## Usage

```js
import Router from '@xhr-mock/router';
import mock from '@xhr-mock/xmlhttprequest';

mock.router = new Router();

mock.setup();

// make calls to XMLHttpRequest

mock.teardown();
```

## License

MIT Licensed. Copyright (c) James Newell 2014.
