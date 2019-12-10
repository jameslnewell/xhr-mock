/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Request, Response, Context} from '../types';

export const noop = (): undefined => undefined;

export const foobarURL = 'http://www.example.com/foo/bar';
export const barfooURL = 'http://www.example.com/bar/foo';

export const getBarfooRequest: Request = {
  version: '1.1',
  method: 'GET',
  url: barfooURL,
  headers: {
    'user-agent': 'xhr-mock',
  },
  body: undefined,
};

export const getFoobarRequest: Request = {
  version: '1.1',
  method: 'GET',
  url: foobarURL,
  headers: {
    'user-agent': 'xhr-mock',
  },
  body: undefined,
};

export const putFoobarRequest: Request = {
  version: '1.1',
  method: 'POST',
  url: foobarURL,
  headers: {
    'user-agent': 'xhr-mock',
    'content-type': 'application/json',
  },
  body: '{"data": "FOO BAR"}',
};

export const getFoobarResponse: Response = {
  version: '1.1',
  status: 200,
  reason: 'OK',
  headers: {
    server: 'xhr-mock',
  },
  body: undefined,
};

export const teapotResponse = {
  version: '1.1',
  status: 418,
  reason: `I'm a teapot`,
  headers: {},
  body: undefined,
};

export const synchronousContext: Context = {
  isAsynchronous: false,
};

export const asynchronousContext: Context = {
  isAsynchronous: true,
};

export const middlewareErrorMessage = 'Oops!';

export const returnMiddleware = () => getFoobarResponse;

export const resolveMiddleware = () => Promise.resolve(getFoobarResponse);

export const throwMiddleware = () => {
  throw new Error(middlewareErrorMessage);
};

export const rejectMiddleware = () =>
  Promise.reject(new Error(middlewareErrorMessage));
