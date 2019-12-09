import {Request, Response, Context} from '@xhr-mock/router';
import sequence from '.';

const request: Request = {
  version: '1.1',
  method: 'get',
  url: 'http://localhost/',
  headers: {},
  body: 'Hello World',
};

const response: Response = {
  version: '1.1',
  status: 206,
  reason: 'Partial Content',
  headers: {},
  body: 'Hello World',
};

const context: Context = {
  isAsynchronous: true,
};

describe('sequence()', () => {
  test('should return undefined when called with zero mocks', async () => {
    const middleware = sequence([]);
    expect(await middleware(request, context)).toBeUndefined();
    expect(await middleware(request, context)).toBeUndefined();
  });

  test('should return a response once when called with one mock', async () => {
    const middleware = sequence([response]);
    expect(await middleware(request, context)).toEqual(response);
    expect(await middleware(request, context)).toBeUndefined();
  });

  test('should return a response twice when called with two mocks', async () => {
    const middleware = sequence([response, response]);
    expect(await middleware(request, context)).toEqual(response);
    expect(await middleware(request, context)).toEqual(response);
    expect(await middleware(request, context)).toBeUndefined();
  });
});
