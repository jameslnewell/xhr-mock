import {Request, Response, Context, Mode} from '@xhr-mock/router';
import once from '.';

const defaultRequest: Request = {
  version: '1.1',
  method: 'get',
  url: '/',
  params: {},
  headers: {},
  body: 'Hello World'
};

const defaultResponse: Response = {
  version: '1.1',
  status: 206,
  reason: 'Partial Content',
  headers: {},
  body: 'Hello World'
};

const defaultContext: Context = {
  mode: Mode.ASYNC
};

describe('once()', () => {
  it('should only return a response the first time the middleware is called', async () => {
    const middleware = once(defaultResponse);
    const first = await middleware(defaultRequest, defaultContext);
    const second = await middleware(defaultRequest, defaultContext);
    expect(first).toEqual(defaultResponse);
    expect(second).toBeUndefined();
  });

  it('should only return a response the first time the middleware is called', async () => {
    const middleware = once(() => defaultResponse);
    const first = await middleware(defaultRequest, defaultContext);
    const second = await middleware(defaultRequest, defaultContext);
    expect(first).toEqual(defaultResponse);
    expect(second).toBeUndefined();
  });
});
