import MockRequest from '../MockRequest';
import MockResponse from '../MockResponse';
import {once} from './once';

describe('once()', () => {
  it('should only return a response when inited with a mock function and called for the first time', async () => {
    const handler = once((req, res) => res.status(201).body('Hello World!'));
    const first = await handler(new MockRequest(), new MockResponse());
    const second = await handler(new MockRequest(), new MockResponse());
    expect(first).toBeInstanceOf(MockResponse);
    if (first) {
      expect(first.status()).toEqual(201);
      expect(first.body()).toEqual('Hello World!');
    }
    expect(second).toBeUndefined();
  });

  it('should only return a response when inited with a mock object and called for the first time', async () => {
    const handler = once({status: 201, body: 'Hello World!'});
    const first = await handler(new MockRequest(), new MockResponse());
    const second = await handler(new MockRequest(), new MockResponse());
    expect(first).toBeInstanceOf(MockResponse);
    if (first) {
      expect(first.status()).toEqual(201);
      expect(first.body()).toEqual('Hello World!');
    }
    expect(second).toBeUndefined();
  });
});
