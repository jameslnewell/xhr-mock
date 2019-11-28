import {
  Request,
  Response,
  Context,
  Mode,
  ExecutionContext,
} from '@xhr-mock/router';
import delay from '.';

const defaultRequest: Request = {
  version: '1.1',
  method: 'get',
  url: '/',
  params: {},
  headers: {},
  body: 'Hello World',
};

const defaultResponse: Response = {
  version: '1.1',
  status: 206,
  reason: 'Partial Content',
  headers: {},
  body: 'Hello World',
};

const defaultContext: Context = {
  execution: ExecutionContext.Asynchronous,
};

const ms = 250;

describe('delay()', () => {
  it('should not delay the response when the middleware does not return a response', async () => {
    const start = Date.now();
    const res = await delay(() => undefined, ms)(
      defaultRequest,
      defaultContext,
    );
    const finish = Date.now();
    expect(finish - start).toBeLessThanOrEqual(ms);
    expect(res).toBeUndefined();
  });

  it('should not delay the response when the middleware does not resolve a response', async () => {
    const start = Date.now();
    const response = await delay(() => Promise.resolve(undefined), ms)(
      defaultRequest,
      defaultContext,
    );
    const finish = Date.now();
    expect(finish - start).toBeLessThanOrEqual(ms);
    expect(response).toBeUndefined();
  });

  it('should delay the response when the middleware is a response', async () => {
    const start = Date.now();
    const res = await delay(defaultResponse, ms)(
      defaultRequest,
      defaultContext,
    );
    const finish = Date.now();
    expect(finish - start).toBeGreaterThanOrEqual(ms);
    expect(res).toEqual(defaultResponse);
  });

  it('should delay the response when the middleware returns a response', async () => {
    const start = Date.now();
    const res = await delay(() => defaultResponse, ms)(
      defaultRequest,
      defaultContext,
    );
    const finish = Date.now();
    expect(finish - start).toBeGreaterThanOrEqual(ms);
    expect(res).toEqual(defaultResponse);
  });

  it('should delay the response when the middleware resolves a response', async () => {
    const start = Date.now();
    const res = await delay(() => Promise.resolve(defaultResponse), ms)(
      defaultRequest,
      defaultContext,
    );
    const finish = Date.now();
    expect(finish - start).toBeGreaterThanOrEqual(ms);
    expect(res).toEqual(defaultResponse);
  });
});
