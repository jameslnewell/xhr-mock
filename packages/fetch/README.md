# @xhr-mock/fetch

[![Build Status](https://travis-ci.org/jameslnewell/xhr-mock.svg?branch=master)](https://travis-ci.org/jameslnewell/xhr-mock)

A mock for fetch.

> Attempts to adhere to https://fetch.spec.whatwg.org/

## Installation

```bash
yarn add @xhr-mock/fetch
```

## Usage

```js
import Router from '@xhr-mock/router';
import mock from '@xhr-mock/fetch';

mock.router = new Router();

mock.setup();

// make calls to fetch()

mock.teardown();
```

## API

## License

MIT Licensed. Copyright (c) James Newell 2014.
