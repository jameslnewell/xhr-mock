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
import FetchMock from '@xhr-mock/fetch';

FetchMock.router = new Router();

FetchMock.setup();

// make calls to fetch()

FetchMock.teardown();
```

## API

## License

MIT Licensed. Copyright (c) James Newell 2014.
