# @xhr-mock/sequence

[![Build Status](https://travis-ci.org/jameslnewell/xhr-mock.svg?branch=master)](https://travis-ci.org/jameslnewell/xhr-mock)

A utility for executing a sequence of middlewares.

## Installation

```bash
yarn add @xhr-mock/sequence
```

## Usage

```js
import sequence from '@xhr-mock/sequence';

const middleware = sequence([
  {
    status: 200,
    body: 'Monday',
  },
  {
    status: 200,
    body: 'Tuesday',
  },
]);
```

## License

MIT Licensed. Copyright (c) James Newell 2014.
