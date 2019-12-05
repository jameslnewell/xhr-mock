# @xhr-mock/once

[![Build Status](https://travis-ci.org/jameslnewell/xhr-mock.svg?branch=master)](https://travis-ci.org/jameslnewell/xhr-mock)

A utility for executing a middleware once.

## Installation

```bash
yarn add @xhr-mock/once
```

## Usage

```js
import once from '@xhr-mock/once';

const middleware = once({
  status: 200,
  body: 'Hello World!',
});
```

## License

MIT Licensed. Copyright (c) James Newell 2014.
