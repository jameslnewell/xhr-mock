import {createMockRouter} from './__tests__/createMockRouter';
import {
  getFoobarRequest,
  getFoobarResponse,
  synchronousContext,
  asynchronousContext,
  noop,
  throwMiddleware,
  returnMiddleware,
} from './__tests__/fixtures';
import {Router} from './Router';

function createListenerAndResolveMiddleware(): [
  string[],
  jest.Mock,
  jest.Mock,
] {
  const events: string[] = [];
  return [
    events,
    jest.fn(() => {
      events.push('listener');
    }),
    jest.fn(() => {
      events.push('middleware');
      return getFoobarResponse;
    }),
  ];
}

function createListenerAndRejectMiddleware(): [string[], jest.Mock, jest.Mock] {
  const events: string[] = [];
  return [
    events,
    jest.fn(() => {
      events.push('listener');
    }),
    jest.fn(() => {
      events.push('middleware');
      return throwMiddleware();
    }),
  ];
}

describe('Router', () => {
  describe('events', () => {
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(noop);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(noop);

    afterEach(() => {
      infoSpy.mockReset();
      errorSpy.mockReset();
    });

    test('logs the request and response when there are no "after" listeners registered', () => {
      const router = new Router();
      router.use(returnMiddleware);
      router.routeSync(getFoobarRequest);
      expect(console.info).toBeCalledWith(
        expect.stringContaining(
          'A middleware returned a response for the request.',
        ),
      );
    });

    test('does not log the request and response when there is an "after" listener registered', () => {
      const router = new Router();
      router.on('after', noop);
      router.use(returnMiddleware);
      router.routeSync(getFoobarRequest);
      expect(console.info).not.toBeCalled();
    });

    test('logs the error when there are no "error" listeners registered', () => {
      const router = new Router();
      router.use(throwMiddleware);
      try {
        router.routeSync(getFoobarRequest);
      } catch (error) {}
      expect(console.error).toBeCalledWith(
        expect.stringContaining(
          'A middleware returned an error for the request.',
        ),
      );
    });

    test('does not log the error when there is an "error" listener registered', () => {
      const router = new Router();
      router.on('error', noop);
      router.use(throwMiddleware);
      try {
        router.routeSync(getFoobarRequest);
      } catch (error) {}
      expect(console.error).not.toBeCalled();
    });

    describe('sync', () => {
      test('the "before" event was called before the request was handled', () => {
        const [
          events,
          listener,
          middleware,
        ] = createListenerAndResolveMiddleware();
        const router = createMockRouter();
        router.on('before', listener);
        router.use(middleware);
        router.routeSync(getFoobarRequest);
        expect(listener).toBeCalledWith({
          context: synchronousContext,
          request: expect.objectContaining(getFoobarRequest),
        });
        expect(events).toEqual(['listener', 'middleware']);
      });

      test('the "after" event was called after the request was handled', () => {
        const [
          events,
          listener,
          middleware,
        ] = createListenerAndResolveMiddleware();
        const router = createMockRouter();
        router.on('after', listener);
        router.use(middleware);
        router.routeSync(getFoobarRequest);
        expect(listener).toBeCalledWith({
          context: synchronousContext,
          request: expect.objectContaining(getFoobarRequest),
          response: getFoobarResponse,
        });
        expect(events).toEqual(['middleware', 'listener']);
      });

      test('the "error" event was emitted after the request errored', () => {
        const [
          events,
          listener,
          middleware,
        ] = createListenerAndRejectMiddleware();
        const router = createMockRouter();
        router.on('error', listener);
        router.use(middleware);
        try {
          router.routeSync(getFoobarRequest);
        } catch (error) {}
        expect(listener).toBeCalledWith({
          context: synchronousContext,
          request: expect.objectContaining(getFoobarRequest),
          error: expect.objectContaining({
            message: expect.stringContaining('Oops'),
          }),
        });
        expect(events).toEqual(['middleware', 'listener']);
      });
    });

    describe('async', () => {
      test('the "before" event was called before the request was handled', async () => {
        const [
          events,
          listener,
          middleware,
        ] = createListenerAndResolveMiddleware();
        const router = createMockRouter();
        router.on('before', listener);
        router.use(middleware);
        await router.routeAsync(getFoobarRequest);
        expect(listener).toBeCalledWith({
          context: asynchronousContext,
          request: expect.objectContaining(getFoobarRequest),
        });
        expect(events).toEqual(['listener', 'middleware']);
      });

      test('the "after" event was called after the request was handled', async () => {
        const [
          events,
          listener,
          middleware,
        ] = createListenerAndResolveMiddleware();
        const router = createMockRouter();
        router.on('after', listener);
        router.use(middleware);
        await router.routeAsync(getFoobarRequest);
        expect(listener).toBeCalledWith({
          context: asynchronousContext,
          request: expect.objectContaining(getFoobarRequest),
          response: getFoobarResponse,
        });
        expect(events).toEqual(['middleware', 'listener']);
      });

      test('the "error" event was emitted after the request errored', async () => {
        const [
          events,
          listener,
          middleware,
        ] = createListenerAndRejectMiddleware();
        const router = createMockRouter();
        router.on('error', listener);
        router.use(middleware);
        try {
          await router.routeAsync(getFoobarRequest);
        } catch (error) {}
        expect(listener).toBeCalledWith({
          context: asynchronousContext,
          request: expect.objectContaining(getFoobarRequest),
          error: expect.objectContaining({
            message: expect.stringContaining('Oops'),
          }),
        });
        expect(events).toEqual(['middleware', 'listener']);
      });
    });
  });
});
