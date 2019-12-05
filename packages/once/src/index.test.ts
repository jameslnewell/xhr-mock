import {Request, Response, Context, ExecutionContext} from '@xhr-mock/router';
import once from '.';

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
  execution: ExecutionContext.Asynchronous,
};

describe('once()', () => {
  test('should return a response once when called with one mock', async () => {
    const middleware = once(response);
    expect(await middleware(request, context)).toEqual(response);
    expect(await middleware(request, context)).toBeUndefined();
  });
});
