# @xhr-mock/delay

[![Build Status](https://travis-ci.org/jameslnewell/xhr-mock.svg?branch=master)](https://travis-ci.org/jameslnewell/xhr-mock)

A utility for delaying the execution of a middleware.

## Installation

```bash
yarn add @xhr-mock/once
```

## Usage

```js
import delay from '@xhr-mock/delay';

const middleware = delay({
  body: {
    data: {
      id: 1,
      fname: 'Johnny',
      lname: 'Appleseed',
      email: 'johnny.appleseed@example.com'
    }
  }
});
```

## API

### `delay(response)`

### `delay(middleware)`

## License

MIT Licensed. Copyright (c) James Newell 2014.
