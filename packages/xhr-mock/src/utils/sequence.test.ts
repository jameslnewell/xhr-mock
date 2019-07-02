import MockRequest from '../MockRequest';
import MockResponse from '../MockResponse';
import {sequence} from './sequence';

describe('sequence()', () => {
  it('should return undefined response when inited with empty array ', async () => {
    const handler = sequence([]);
    const first = await handler(new MockRequest(), new MockResponse());
    
    expect(first).toBeUndefined();
  });

  it('should return a response when inited with two mocks and called for the first two time', async () => {
    const handler = sequence([
      (req, res) => res.status(201).body('Hello'),
      {status: 201, body: 'World!'}
    ]);
    const first = await handler(new MockRequest(), new MockResponse());
    const second = await handler(new MockRequest(), new MockResponse());
    const third = await handler(new MockRequest(), new MockResponse());
    expect(first).toBeInstanceOf(MockResponse);
    if (first) {
      expect(first.status()).toEqual(201);
      expect(first.body()).toEqual('Hello');
    }
    expect(second).toBeInstanceOf(MockResponse);
    if (second) {
      expect(second.status()).toEqual(201);
      expect(second.body()).toEqual('World!');
    }
    expect(third).toBeUndefined();
  });
});
