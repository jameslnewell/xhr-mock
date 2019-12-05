// tslint:disable: no-shadowed-variable
import {Request, Response, ExecutionContext} from './types';
import {createMockRouter} from './__tests__/createMockRouter';

const foobarURL = 'http://www.example.com/foo/bar';
const abcURL = 'http://www.example.com/abc';

const defaultRequest: Request = {
  version: '1.1',
  method: 'GET',
  url: foobarURL,
  headers: {},
  body: undefined,
};

const defaultResponse: Response = {
  version: '1.1',
  status: 200,
  reason: 'OK',
  headers: {},
  body: undefined,
};

const noop = (): undefined => undefined;

describe('Router', () => {
  test('should match the middleware', () => {
    const router = createMockRouter();
    router.get('/foo/bar', () => defaultResponse);
    expect(router.routeSync(defaultRequest)).toEqual({
      ...defaultResponse,
      url: foobarURL,
      redirected: false,
    });
  });

  test('should not match the middleware', () => {
    const router = createMockRouter();
    router.post('/bar', () => defaultResponse);
    expect(() => router.routeSync(defaultRequest)).toThrow();
  });

  describe('sync', () => {
    test('should throw an error when there are no middlewares and no response is returned', () => {
      const router = createMockRouter();
      expect(() => router.routeSync(defaultRequest)).toThrowError(
        /No middleware returned a response for the request./,
      );
    });

    test('should throw an error when there are middlwares and no response is returned by any of the middleware', () => {
      const router = createMockRouter();
      router.use(noop);
      router.use(noop);
      expect(() => router.routeSync(defaultRequest)).toThrowError(
        /No middleware returned a response for the request./,
      );
    });

    test('should throw an error when a middleware returns a response asynchronously', () => {
      const router = createMockRouter();
      router.use(() => Promise.resolve(defaultResponse));
      expect(() => router.routeSync(defaultRequest)).toThrowError(
        /A middleware returned a response asynchronously while the request was being handled synchronously./,
      );
    });

    test('should emit the "before" event before the request is handled', () => {
      const order: string[] = [];

      const listener = jest.fn(() => {
        order.push('listener');
      });

      const middleware = jest.fn(() => {
        order.push('middleware');
        return defaultResponse;
      });

      const router = createMockRouter();
      router.on('before', listener);
      router.get('/foo/bar', middleware);
      router.routeSync(defaultRequest);
      expect(listener).toBeCalledWith({
        context: {execution: ExecutionContext.Synchronous},
        request: expect.objectContaining(defaultRequest),
      });
      expect(order).toEqual(['listener', 'middleware']);
    });

    test('should call the middleware with a normalised request', () => {
      const middleware = jest.fn().mockReturnValue(defaultResponse);
      const router = createMockRouter();
      router.put('/abc', middleware);
      router.routeSync({method: 'put', url: abcURL});
      expect(middleware).toBeCalledWith(
        {
          version: '1.1',
          method: 'PUT',
          url: abcURL,
          params: {},
          headers: {},
          body: undefined,
        },
        expect.anything(),
      );
    });

    test('should return a normalised response', () => {
      const router = createMockRouter();
      router.get('/foo/bar', {status: 201});
      const response = router.routeSync(defaultRequest);
      expect(response).toEqual({
        version: '1.1',
        status: 201,
        reason: 'Created',
        headers: {},
        body: undefined,
        url: foobarURL,
        redirected: false,
      });
    });

    test('should emit the "after" event before the request is handled', () => {
      const order: string[] = [];

      const listener = jest.fn(() => {
        order.push('listener');
      });

      const middleware = jest.fn(() => {
        order.push('middleware');
        return defaultResponse;
      });

      const router = createMockRouter();
      router.on('after', listener);
      router.get('/foo/bar', middleware);
      router.routeSync(defaultRequest);
      expect(listener).toBeCalledWith({
        context: {execution: ExecutionContext.Synchronous},
        request: expect.objectContaining(defaultRequest),
        response: defaultResponse,
      });
      expect(order).toEqual(['middleware', 'listener']);
    });

    test('should call the error listener when there is an error handling the request', () => {
      expect.assertions(1);
      const listener = jest.fn();
      const router = createMockRouter();
      router.on('error', listener);
      router.get('/foo/bar', () => {
        throw new Error('Oops');
      });
      try {
        router.routeSync(defaultRequest);
      } catch (error) {
        // an error is expected
        expect(listener).toBeCalledWith({
          context: {execution: ExecutionContext.Synchronous},
          request: expect.objectContaining(defaultRequest),
          error: expect.objectContaining({
            message: expect.stringContaining('Oops'),
          }),
        });
      }
    });
  });

  describe('async', () => {
    test('should throw an error when there are no middlewares and no response is returned', async () => {
      const router = createMockRouter();
      await expect(router.routeAsync(defaultRequest)).rejects.toThrowError(
        /No middleware returned a response for the request./,
      );
    });

    test('should throw an error when there are middlwares and no response is returned by any of the middleware', async () => {
      const router = createMockRouter();
      router.use(noop);
      router.use(noop);
      await expect(router.routeAsync(defaultRequest)).rejects.toThrowError(
        /No middleware returned a response for the request./,
      );
    });

    test('should emit the "before" event before the request is handled', async () => {
      const order: string[] = [];

      const listener = jest.fn(() => {
        order.push('listener');
      });

      const middleware = jest.fn(() => {
        order.push('middleware');
        return defaultResponse;
      });

      const router = createMockRouter();
      router.on('before', listener);
      router.get('/foo/bar', middleware);
      await router.routeAsync(defaultRequest);
      expect(listener).toBeCalledWith({
        context: {execution: ExecutionContext.Asynchronous},
        request: expect.objectContaining(defaultRequest),
      });
      expect(order).toEqual(['listener', 'middleware']);
    });

    test('should call the middleware with a normalised request', async () => {
      const middleware = jest.fn().mockReturnValue(defaultResponse);
      const router = createMockRouter();
      router.put('/abc', middleware);
      await router.routeAsync({method: 'put', url: abcURL});
      expect(middleware).toBeCalledWith(
        {
          version: '1.1',
          method: 'PUT',
          url: abcURL,
          params: {},
          headers: {},
          body: undefined,
        },
        expect.anything(),
      );
    });

    test('should return a normalised response synchronously', async () => {
      const router = createMockRouter();
      router.get('/foo/bar', {status: 201});
      const response = await router.routeAsync(defaultRequest);
      expect(response).toEqual({
        version: '1.1',
        status: 201,
        reason: 'Created',
        headers: {},
        body: undefined,
        url: foobarURL,
        redirected: false,
      });
    });

    test('should return a normalised response asynchronously', async () => {
      const router = createMockRouter();
      router.get('/foo/bar', () => Promise.resolve({status: 201}));
      const response = await router.routeAsync(defaultRequest);
      expect(response).toEqual({
        version: '1.1',
        status: 201,
        reason: 'Created',
        headers: {},
        body: undefined,
        url: foobarURL,
        redirected: false,
      });
    });

    test('should emit the "after" event before the request is handled', async () => {
      const order: string[] = [];

      const listener = jest.fn(() => {
        order.push('listener');
      });

      const middleware = jest.fn(() => {
        order.push('middleware');
        return defaultResponse;
      });

      const router = createMockRouter();
      router.on('after', listener);
      router.get('/foo/bar', middleware);
      await router.routeAsync(defaultRequest);
      expect(listener).toBeCalledWith({
        context: {execution: ExecutionContext.Asynchronous},
        request: expect.objectContaining(defaultRequest),
        response: defaultResponse,
      });
      expect(order).toEqual(['middleware', 'listener']);
    });

    test('should call the error listener when there is an error handling the request', async () => {
      expect.assertions(1);
      const listener = jest.fn();
      const router = createMockRouter();
      router.on('error', listener);
      router.get('/foo/bar', () => {
        throw new Error('Oops');
      });
      try {
        await router.routeAsync(defaultRequest);
      } catch (error) {
        // an error is expected
        expect(listener).toBeCalledWith({
          context: {execution: ExecutionContext.Asynchronous},
          request: expect.objectContaining(defaultRequest),
          error: expect.objectContaining({
            message: expect.stringContaining('Oops'),
          }),
        });
      }
    });
  });
});
