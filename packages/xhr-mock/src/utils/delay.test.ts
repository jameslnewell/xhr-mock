import MockRequest from '../MockRequest';
import MockResponse from '../MockResponse';
import {delay} from './delay';

const ms = 250;

describe('delay()', () => {
  it('should not delay the response when the handler does not return a response', async () => {
    const start = Date.now();
    const res = await delay(() => undefined, ms)(new MockRequest(), new MockResponse());
    const finish = Date.now();
    expect(finish - start).toBeLessThanOrEqual(ms);
    expect(res).not.toBeInstanceOf(MockResponse);
    expect(res).toBeUndefined();
  });

  it('should not delay the response when the handler does not resolve a response', async () => {
    const start = Date.now();
    const res = await delay(() => Promise.resolve(undefined), ms)(new MockRequest(), new MockResponse());
    const finish = Date.now();
    expect(finish - start).toBeLessThanOrEqual(ms);
    expect(res).not.toBeInstanceOf(MockResponse);
    expect(res).toBeUndefined();
  });

  it('should delay the response when the handler returns a response', async () => {
    const start = Date.now();
    const res = await delay((req, res) => res.status(201).body('Hello World!'), ms)(
      new MockRequest(),
      new MockResponse()
    );
    const finish = Date.now();
    expect(finish - start).toBeGreaterThanOrEqual(ms);
    expect(res).toBeInstanceOf(MockResponse);
    if (res) {
      expect(res.status()).toEqual(201);
      expect(res.body()).toEqual('Hello World!');
    }
  });

  it('should delay the response when the handler does resolve a response', async () => {
    const start = Date.now();
    const res = await delay((req, res) => Promise.resolve(res.status(201).body('Hello World!')), ms)(
      new MockRequest(),
      new MockResponse()
    );
    const finish = Date.now();
    expect(finish - start).toBeGreaterThanOrEqual(ms);
    expect(res).toBeInstanceOf(MockResponse);
    if (res) {
      expect(res.status()).toEqual(201);
      expect(res.body()).toEqual('Hello World!');
    }
  });

  it('should delay the response when the handler is a response object', async () => {
    const start = Date.now();
    const res = await delay({status: 201, body: 'Hello World!'}, ms)(new MockRequest(), new MockResponse());
    const finish = Date.now();
    expect(finish - start).toBeGreaterThanOrEqual(ms);
    expect(res).toBeInstanceOf(MockResponse);
    if (res) {
      expect(res.status()).toEqual(201);
      expect(res.body()).toEqual('Hello World!');
    }
  });
});
