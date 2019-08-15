// tslint:disable: no-shadowed-variable
import {Request, Response, Context, Mode} from './types';
import {Router} from './Router';

const defaultRequest: Request = {
  version: '1.1',
  method: 'GET',
  url: '/foo/bar',
  params: {},
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

const defaultContext: Context = {
  mode: Mode.ASYNC,
};

const noop = () => undefined;

const createMockRouter = () => {
  return new Router().on('error', noop);
};

describe('Router', () => {
  it('should match the middleware', () => {
    const router = createMockRouter();
    router.get('/foo/bar', () => defaultResponse);
    expect(router.routeSync(defaultRequest, defaultContext)).toEqual(
      defaultResponse,
    );
  });

  it('should not match the middleware', () => {
    const router = createMockRouter();
    router.post('/bar', () => defaultResponse);
    expect(() => router.routeSync(defaultRequest, defaultContext)).toThrow();
  });

  describe('sync', () => {
    it('should throw an error when there are no middlewares and no response is returned', () => {
      const router = createMockRouter();
      expect(() =>
        router.routeSync(defaultRequest, defaultContext),
      ).toThrowError(/No middleware returned a response for the request./);
    });

    it('should throw an error when there are middlwares and no response is returned by any of the middleware', () => {
      const router = createMockRouter();
      router.use(noop);
      router.use(noop);
      expect(() =>
        router.routeSync(defaultRequest, defaultContext),
      ).toThrowError(/No middleware returned a response for the request./);
    });

    it('should throw an error when a middleware returns a response asynchronously', () => {
      const router = createMockRouter();
      router.use(() => Promise.resolve(defaultResponse));
      expect(() =>
        router.routeSync(defaultRequest, defaultContext),
      ).toThrowError(
        /A middleware returned a response asynchronously while the request was being handled synchronously./,
      );
    });

    it('should emit the "before" event before the request is handled', () => {
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
      router.routeSync(defaultRequest, defaultContext);
      expect(listener).toBeCalledWith({
        context: {mode: Mode.SYNC},
        request: defaultRequest,
      });
      expect(order).toEqual(['listener', 'middleware']);
    });

    it('should call the middleware with a normalised request', () => {
      const middleware = jest.fn().mockReturnValue(defaultResponse);
      const router = createMockRouter();
      router.put('/abc', middleware);
      router.routeSync({method: 'put', url: '/abc'}, defaultContext);
      expect(middleware).toBeCalledWith(
        {
          version: '1.1',
          method: 'PUT',
          url: '/abc',
          params: {},
          headers: {},
          body: undefined,
        },
        expect.anything(),
      );
    });

    it('should return a normalised response', () => {
      const router = createMockRouter();
      router.get('/foo/bar', {status: 201});
      const response = router.routeSync(defaultRequest, defaultContext);
      expect(response).toEqual({
        version: '1.1',
        status: 201,
        reason: 'Created',
        headers: {},
        body: undefined,
      });
    });

    it('should emit the "after" event before the request is handled', () => {
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
      router.routeSync(defaultRequest, defaultContext);
      expect(listener).toBeCalledWith({
        context: {mode: Mode.SYNC},
        request: defaultRequest,
        response: defaultResponse,
      });
      expect(order).toEqual(['middleware', 'listener']);
    });

    it('should call the error listener when there is an error handling the request', () => {
      expect.assertions(1);
      const listener = jest.fn();
      const router = createMockRouter();
      router.on('error', listener);
      router.get('/foo/bar', () => {
        throw new Error('Oops');
      });
      try {
        router.routeSync(defaultRequest, defaultContext);
      } catch (error) {
        // an error is expected
        expect(listener).toBeCalledWith({
          context: {mode: Mode.SYNC},
          request: defaultRequest,
          error: expect.objectContaining({
            message: expect.stringContaining('Oops'),
          }),
        });
      }
    });
  });

  describe('async', () => {
    it('should throw an error when there are no middlewares and no response is returned', async () => {
      const router = createMockRouter();
      await expect(
        router.routeAsync(defaultRequest, defaultContext),
      ).rejects.toThrowError(
        /No middleware returned a response for the request./,
      );
    });

    it('should throw an error when there are middlwares and no response is returned by any of the middleware', async () => {
      const router = createMockRouter();
      router.use(noop);
      router.use(noop);
      await expect(
        router.routeAsync(defaultRequest, defaultContext),
      ).rejects.toThrowError(
        /No middleware returned a response for the request./,
      );
    });

    it('should emit the "before" event before the request is handled', async () => {
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
      await router.routeAsync(defaultRequest, defaultContext);
      expect(listener).toBeCalledWith({
        context: {mode: Mode.ASYNC},
        request: defaultRequest,
      });
      expect(order).toEqual(['listener', 'middleware']);
    });

    it('should call the middleware with a normalised request', async () => {
      const middleware = jest.fn().mockReturnValue(defaultResponse);
      const router = createMockRouter();
      router.put('/abc', middleware);
      await router.routeAsync({method: 'put', url: '/abc'}, defaultContext);
      expect(middleware).toBeCalledWith(
        {
          version: '1.1',
          method: 'PUT',
          url: '/abc',
          params: {},
          headers: {},
          body: undefined,
        },
        expect.anything(),
      );
    });

    it('should return a normalised response synchronously', async () => {
      const router = createMockRouter();
      router.get('/foo/bar', {status: 201});
      const response = await router.routeAsync(defaultRequest, defaultContext);
      expect(response).toEqual({
        version: '1.1',
        status: 201,
        reason: 'Created',
        headers: {},
        body: undefined,
      });
    });

    it('should return a normalised response asynchronously', async () => {
      const router = createMockRouter();
      router.get('/foo/bar', () => Promise.resolve({status: 201}));
      const response = await router.routeAsync(defaultRequest, defaultContext);
      expect(response).toEqual({
        version: '1.1',
        status: 201,
        reason: 'Created',
        headers: {},
        body: undefined,
      });
    });

    it('should emit the "after" event before the request is handled', async () => {
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
      await router.routeAsync(defaultRequest, defaultContext);
      expect(listener).toBeCalledWith({
        context: {mode: Mode.ASYNC},
        request: defaultRequest,
        response: defaultResponse,
      });
      expect(order).toEqual(['middleware', 'listener']);
    });

    it('should call the error listener when there is an error handling the request', async () => {
      expect.assertions(1);
      const listener = jest.fn();
      const router = createMockRouter();
      router.on('error', listener);
      router.get('/foo/bar', () => {
        throw new Error('Oops');
      });
      try {
        await router.routeAsync(defaultRequest, defaultContext);
      } catch (error) {
        // an error is expected
        expect(listener).toBeCalledWith({
          context: {mode: Mode.ASYNC},
          request: defaultRequest,
          error: expect.objectContaining({
            message: expect.stringContaining('Oops'),
          }),
        });
      }
    });
  });
});
