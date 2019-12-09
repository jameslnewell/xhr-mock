import {Request, Response, Context} from '@xhr-mock/router';
import delay from '.';

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

const ms = 250;

describe('delay()', () => {
  test('returns undefined immediately when the middleware does not return a response', async () => {
    const result = delay(() => undefined, ms)(request, context);
    expect(result).toBeUndefined();
  });

  test('resolves undefined immediately when the middleware does not resolve a response', async () => {
    const start = Date.now();
    const result = await delay(() => Promise.resolve(undefined), ms)(
      request,
      context,
    );
    const finish = Date.now();
    expect(finish - start).toBeLessThan(ms);
    expect(result).toBeUndefined();
  });

  test('resolves a response after a delay when the middleware returns a response ', async () => {
    const start = Date.now();
    const result = await delay(response, ms)(request, context);
    const finish = Date.now();
    expect(finish - start).toBeGreaterThanOrEqual(ms);
    expect(result).toEqual(response);
  });

  test('resolves a response after a delay when the middleware resolves a response', async () => {
    const start = Date.now();
    const result = await delay(() => Promise.resolve(response), ms)(
      request,
      context,
    );
    const finish = Date.now();
    expect(finish - start).toBeGreaterThanOrEqual(ms);
    expect(result).toEqual(response);
  });
});
