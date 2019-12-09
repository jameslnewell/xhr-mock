import {Request, Response, Context, Middleware} from '../types';

export const noop = (): undefined => undefined;

export const foobarURL = 'http://www.example.com/foo/bar';
export const barfooURL = 'http://www.example.com/bar/foo';

export const getFoobarRequest: Request = {
  version: '1.1',
  method: 'GET',
  url: foobarURL,
  headers: {},
  body: undefined,
};

export const getFoobarResponse: Response = {
  version: '1.1',
  status: 200,
  reason: 'OK',
  headers: {},
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

export const returnMiddleware: Middleware = () => getFoobarResponse;

export const resolveMiddleware: Middleware = () =>
  Promise.resolve(getFoobarResponse);

export const throwMiddleware: Middleware = () => {
  throw new Error(middlewareErrorMessage);
};

export const rejectMiddleware: Middleware = () =>
  Promise.reject(new Error(middlewareErrorMessage));
