# @xhr-mock/delay

[![Build Status](https://travis-ci.org/jameslnewell/xhr-mock.svg?branch=master)](https://travis-ci.org/jameslnewell/xhr-mock)

A utility for delaying the execution of a middleware.

## Installation

```bash
yarn add @xhr-mock/delay
```

## Usage

```js
import delay from '@xhr-mock/delay';

const middleware = delay({
  status: 200,
  body: 'Hello World!',
});
```

## License

MIT Licensed. Copyright (c) James Newell 2014.
