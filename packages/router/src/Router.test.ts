// tslint:disable: no-shadowed-variable
import {Request, Response, Context, Mode} from './types';
import {Router} from './Router';

const defaultRequest: Request = {
  version: '1.1',
  method: 'GET',
  uri: '/foo/bar',
  params: {},
  headers: {},
  body: undefined
};

const defaultResponse: Response = {
  version: '1.1',
  status: 200,
  reason: 'OK',
  headers: {},
  body: undefined
};

const defaultContext: Context = {
  mode: Mode.ASYNC
};

const noop = () => undefined;

const createMockRouter = () => {
  return new Router().on('error', noop);
};

describe('Router', () => {
  it('should match the middleware', () => {
    const router = createMockRouter();
    router.get('/foo/bar', () => defaultResponse);
    expect(router.handle(Mode.SYNC, defaultRequest, defaultContext)).toEqual(defaultResponse);
  });

  it('should not match the middleware', () => {
    const router = createMockRouter();
    router.post('/bar', () => defaultResponse);
    expect(() => router.handle(Mode.SYNC, defaultRequest, defaultContext)).toThrow();
  });

  describe('sync', () => {
    it('should throw an error when there are no middlewares and no response is returned', () => {
      expect.assertions(1);
      const router = createMockRouter();
      try {
        router.handle(Mode.SYNC, defaultRequest, defaultContext);
      } catch (error) {
        expect(error).toEqual(
          expect.objectContaining({
            message: expect.stringMatching(/No middleware returned a response/i)
          })
        );
      }
    });

    it('should throw an error when there are middlwares and no response is returned by any middleware', () => {
      expect.assertions(1);
      const router = createMockRouter();
      router.use(noop);
      router.use(noop);
      try {
        router.handle(Mode.SYNC, defaultRequest, defaultContext);
      } catch (error) {
        expect(error).toEqual(
          expect.objectContaining({
            message: expect.stringMatching(/No middleware returned a response/i)
          })
        );
      }
    });

    it('should return a response when a middleware returns a response synchronously', () => {
      const router = createMockRouter();
      router.use(() => defaultResponse);
      const actual = router.handle(Mode.SYNC, defaultRequest, defaultContext);
      expect(actual).toEqual(defaultResponse);
    });

    it('should throw an error when a middleware returns a response asynchronously', () => {
      const router = createMockRouter();
      router.use(() => defaultResponse);
      const actual = router.handle(Mode.SYNC, defaultRequest, defaultContext);
      expect(actual).toEqual(defaultResponse);
      try {
        router.handle(Mode.SYNC, defaultRequest, defaultContext);
      } catch (error) {
        expect(error).toEqual(
          expect.objectContaining({
            message: expect.stringMatching(
              /A middleware returned a response asynchronously while the request was being handled synchronously./i
            )
          })
        );
      }
    });

    it('should normalise the request', () => {
      const middleware = jest.fn().mockReturnValue({});
      const request = {method: 'put', uri: '/abc'};
      const router = createMockRouter();
      router.put('/abc', middleware);
      router.handle(Mode.SYNC, request, defaultContext);
      expect(middleware).toBeCalledWith(
        {
          version: '1.1',
          method: 'PUT',
          uri: '/abc',
          params: {},
          headers: {},
          body: undefined
        },
        expect.anything()
      );
    });

    it('should normalise the response', () => {
      const router = createMockRouter();
      router.get('/foo/bar', {status: 201});
      const response = router.handle(Mode.SYNC, defaultRequest, defaultContext);
      expect(response).toEqual({
        version: '1.1',
        status: 201,
        reason: 'Created',
        headers: {},
        body: undefined
      });
    });

    it('should call the before listener before the request is handled', () => {
      const listener = jest.fn();
      const router = createMockRouter();
      router.on('before', listener);
      router.get('/foo/bar', {});
      router.handle(Mode.SYNC, defaultRequest, defaultContext);
      expect(listener).toBeCalledWith({
        context: {mode: Mode.SYNC},
        request: defaultRequest
      });
    });

    it('should call the after listener after the request is handled', () => {
      const listener = jest.fn();
      const router = createMockRouter();
      router.on('after', listener);
      router.get('/foo/bar', {status: 201});
      router.handle(Mode.SYNC, defaultRequest, defaultContext);
      expect(listener).toBeCalledWith({
        context: {mode: Mode.SYNC},
        request: defaultRequest,
        response: expect.objectContaining({
          status: 201,
          reason: 'Created'
        })
      });
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
        router.handle(Mode.SYNC, defaultRequest, defaultContext);
      } catch (error) {
        // error is expected
        expect(listener).toBeCalledWith({
          context: {mode: Mode.SYNC},
          request: defaultRequest,
          error: expect.objectContaining({
            message: expect.stringContaining('Oops')
          })
        });
      }
    });
  });

  describe('async', () => {
    it('should throw an error when there are no middlewares and no response is returned', async () => {
      expect.assertions(1);
      const router = createMockRouter();
      try {
        await router.handle(Mode.ASYNC, defaultRequest, defaultContext);
      } catch (error) {
        expect(error).toEqual(
          expect.objectContaining({
            message: expect.stringMatching(/No middleware returned a response/i)
          })
        );
      }
    });

    it('should throw an error when there are middlwares and no response is returned by any middleware', async () => {
      expect.assertions(1);
      const router = createMockRouter();
      router.use(noop);
      router.use(noop);
      try {
        await router.handle(Mode.ASYNC, defaultRequest, defaultContext);
      } catch (error) {
        expect(error).toEqual(
          expect.objectContaining({
            message: expect.stringMatching(/No middleware returned a response/i)
          })
        );
      }
    });

    it('should return a response when a middleware returns a response synchronously', async () => {
      const router = createMockRouter();
      router.use(() => defaultResponse);
      const actual = await router.handle(Mode.ASYNC, defaultRequest, defaultContext);
      expect(actual).toEqual(defaultResponse);
    });

    it('should return a response when a middleware returns a response asynchronously', async () => {
      const router = createMockRouter();
      router.use(() => Promise.resolve(defaultResponse));
      const actual = await router.handle(Mode.ASYNC, defaultRequest, defaultContext);
      expect(actual).toEqual(defaultResponse);
    });

    it('should normalise the request', async () => {
      const middleware = jest.fn().mockReturnValue({});
      const request = {method: 'put', uri: '/abc'};
      const router = createMockRouter();
      router.put('/abc', middleware);
      await router.handle(Mode.ASYNC, request, defaultContext);
      expect(middleware).toBeCalledWith(
        {
          version: '1.1',
          method: 'PUT',
          uri: '/abc',
          params: {},
          headers: {},
          body: undefined
        },
        expect.anything()
      );
    });

    it('should normalise the response', async () => {
      const router = createMockRouter();
      router.get('/foo/bar', {status: 201});
      const response = await router.handle(Mode.ASYNC, defaultRequest, defaultContext);
      expect(response).toEqual({
        version: '1.1',
        status: 201,
        reason: 'Created',
        headers: {},
        body: undefined
      });
    });

    it('should call the before listener before the request is handled', async () => {
      const listener = jest.fn();
      const router = createMockRouter();
      router.on('before', listener);
      router.get('/foo/bar', {});
      await router.handle(Mode.ASYNC, defaultRequest, defaultContext);
      expect(listener).toBeCalledWith({
        context: defaultContext,
        request: defaultRequest
      });
    });

    it('should call the after listener after the request is handled', async () => {
      const listener = jest.fn();
      const router = createMockRouter();
      router.on('after', listener);
      router.get('/foo/bar', {status: 201});
      await router.handle(Mode.ASYNC, defaultRequest, defaultContext);
      expect(listener).toBeCalledWith({
        context: defaultContext,
        request: defaultRequest,
        response: expect.objectContaining({
          status: 201,
          reason: 'Created'
        })
      });
    });

    it('should call the error listener when there is an error handling the request', async () => {
      expect.assertions(1);
      const listener = jest.fn();
      const router = createMockRouter();
      router.on('error', listener);
      router.get('/foo/bar', () => Promise.reject(new Error('Oops')));
      try {
        await router.handle(Mode.ASYNC, defaultRequest, defaultContext);
      } catch (error) {
        // error is expected
        expect(listener).toBeCalledWith({
          context: defaultContext,
          request: defaultRequest,
          error: expect.objectContaining({
            message: expect.stringContaining('Oops')
          })
        });
      }
    });
  });
});
