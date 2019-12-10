import {createMockRouter} from './__tests__/createMockRouter';
import {
  barfooURL,
  getFoobarRequest,
  getFoobarResponse,
  throwMiddleware,
  rejectMiddleware,
  middlewareErrorMessage,
  resolveMiddleware,
  foobarURL,
  returnMiddleware,
  teapotResponse,
  getBarfooRequest,
} from './__tests__/fixtures';

const methods: (
  | 'options'
  | 'head'
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete')[] = ['options', 'head', 'get', 'post', 'put', 'patch', 'delete'];

const anyURLPattern = /.*/;

const noResponseErrorMessage =
  'No middleware returned a response for the request.';
const urlIsNotAbsoluteErrorMessage = /Request URL must be absolute:/;
const syncMiddlewareReturnedPromiseErrorMessage =
  'A middleware returned a response asynchronously while the request was being handled synchronously.';
const tooManyRedirectsErrorMessage = 'The number of redirects exceeded 10.';
const redirectsWereNotPermittedErrorMessage =
  'A redirect was encountered but redirects were not permitted.';

describe('Router', () => {
  describe('.use()', () => {
    methods.forEach(method => {
      describe(method, () => {
        test(`resolves when the request matches the route method and the method is lowercase`, async () => {
          const router = createMockRouter();
          router.use(method, anyURLPattern, getFoobarResponse);
          await expect(
            router.routeAsync({method: method.toLowerCase(), url: foobarURL}),
          ).resolves.toEqual(expect.objectContaining(getFoobarResponse));
        });

        test(`resolves when the request matches the route method and the method is upercase`, async () => {
          const router = createMockRouter();
          router.use(method, anyURLPattern, getFoobarResponse);
          await expect(
            router.routeAsync({method: method.toUpperCase(), url: foobarURL}),
          ).resolves.toEqual(expect.objectContaining(getFoobarResponse));
        });

        test(`rejects when the request does not match the route url`, async () => {
          const router = createMockRouter();
          router.use(method, '/foo/bar', getFoobarResponse);
          await expect(
            router.routeAsync({method, url: barfooURL}),
          ).rejects.toThrowError(noResponseErrorMessage);
        });

        test(`resolves when the route url is a string and the request url matches `, async () => {
          const router = createMockRouter();
          router.use(method, '/foo/bar', getFoobarResponse);
          await expect(
            router.routeAsync({method, url: foobarURL}),
          ).resolves.toEqual(expect.objectContaining(getFoobarResponse));
        });

        test(`resolves when the route url is a regexp and the request url matches`, async () => {
          const router = createMockRouter();
          router.use(method, /.*/, getFoobarResponse);
          await expect(
            router.routeAsync({method, url: foobarURL}),
          ).resolves.toEqual(expect.objectContaining(getFoobarResponse));
        });

        test(`resolves when the route url has segments and the request url matches`, async () => {
          const router = createMockRouter();
          router.use(method, '/foo/:id', getFoobarResponse);
          await expect(
            router.routeAsync({method, url: foobarURL}),
          ).resolves.toEqual(
            expect.objectContaining({
              ...getFoobarResponse,
            }),
          );
        });
      });
    });
  });

  methods.forEach(method => {
    describe(`.${method}()`, () => {
      test(`rejects when the request does not match the route method`, async () => {
        const router = createMockRouter();
        router[method](anyURLPattern, getFoobarResponse);
        await expect(
          router.routeAsync({method: 'foobar', url: foobarURL}),
        ).rejects.toThrowError(noResponseErrorMessage);
      });

      test(`resolves when the request matches the route method and the method is lowercase`, async () => {
        const router = createMockRouter();
        router[method](anyURLPattern, getFoobarResponse);
        await expect(
          router.routeAsync({method: method.toLowerCase(), url: foobarURL}),
        ).resolves.toEqual(expect.objectContaining(getFoobarResponse));
      });

      test(`resolves when the request matches the route method and the method is upercase`, async () => {
        const router = createMockRouter();
        router[method](anyURLPattern, getFoobarResponse);
        await expect(
          router.routeAsync({method: method.toUpperCase(), url: foobarURL}),
        ).resolves.toEqual(expect.objectContaining(getFoobarResponse));
      });

      test(`rejects when the request does not match the route url with hostname`, async () => {
        const router = createMockRouter();
        router[method](foobarURL, getFoobarResponse);
        await expect(
          router.routeAsync({method, url: 'http://example.com/foo/bar'}),
        ).rejects.toThrowError(noResponseErrorMessage);
      });

      test(`rejects when the request does not match the route url with port`, async () => {
        const router = createMockRouter();
        router[method](foobarURL, getFoobarResponse);
        await expect(
          router.routeAsync({method, url: 'http://localhost:8888/foo/bar'}),
        ).rejects.toThrowError(noResponseErrorMessage);
      });

      test(`rejects when the request does not match the route url with path`, async () => {
        const router = createMockRouter();
        router[method]('/foo/bar', getFoobarResponse);
        await expect(
          router.routeAsync({method, url: barfooURL}),
        ).rejects.toThrowError(noResponseErrorMessage);
      });

      test(`rejects when the request does not match the route url with querystring`, async () => {
        const router = createMockRouter();
        router[method]('/foo/bar?blah=blah', getFoobarResponse);
        await expect(
          router.routeAsync({method, url: foobarURL}),
        ).rejects.toThrowError(noResponseErrorMessage);
      });

      test(`resolves when the route url is a string and the request url matches with hostname`, async () => {
        const router = createMockRouter();
        router[method](foobarURL, getFoobarResponse);
        await expect(
          router.routeAsync({method, url: foobarURL}),
        ).resolves.toEqual(expect.objectContaining(getFoobarResponse));
      });

      test(`resolves when the route url is a string and the request url matches with port`, async () => {
        const router = createMockRouter();
        router[method]('http://localhost:8080/foo/bar', getFoobarResponse);
        await expect(
          router.routeAsync({method, url: 'http://localhost:8080/foo/bar'}),
        ).resolves.toEqual(expect.objectContaining(getFoobarResponse));
      });

      test(`resolves when the route url is a string and the request url matches with path`, async () => {
        const router = createMockRouter();
        router[method]('/foo/bar', getFoobarResponse);
        await expect(
          router.routeAsync({method, url: foobarURL}),
        ).resolves.toEqual(expect.objectContaining(getFoobarResponse));
      });

      test(`resolves when the route url is a regexp and the request url matches`, async () => {
        const router = createMockRouter();
        router[method](/.*/, getFoobarResponse);
        await expect(
          router.routeAsync({method, url: foobarURL}),
        ).resolves.toEqual(expect.objectContaining(getFoobarResponse));
      });

      test(`resolves when the route url has segments and the request url matches`, async () => {
        const router = createMockRouter();
        router[method]('/foo/:id', getFoobarResponse);
        await expect(
          router.routeAsync({method, url: foobarURL}),
        ).resolves.toEqual(
          expect.objectContaining({
            ...getFoobarResponse,
          }),
        );
      });
    });
  });

  describe('.routeSync()', () => {
    test('throws when request URL is not absolute', () => {
      const router = createMockRouter();
      expect(() => router.routeSync({url: '/'})).toThrowError(
        urlIsNotAbsoluteErrorMessage,
      );
    });

    test('throws when there are no middlewares', () => {
      const router = createMockRouter();
      expect(() => router.routeSync(getFoobarRequest)).toThrowError(
        noResponseErrorMessage,
      );
    });

    test('throws when no response is returned', () => {
      const router = createMockRouter();
      expect(() => router.routeSync(getFoobarRequest)).toThrowError(
        noResponseErrorMessage,
      );
    });

    test('throws when a middleware throws', () => {
      const router = createMockRouter();
      router.use(throwMiddleware);
      expect(() => router.routeSync(getFoobarRequest)).toThrowError(
        middlewareErrorMessage,
      );
    });

    test('throws when a middleware resolves', () => {
      const router = createMockRouter();
      router.use(resolveMiddleware);
      expect(() => router.routeSync(getFoobarRequest)).toThrowError(
        syncMiddlewareReturnedPromiseErrorMessage,
      );
    });

    // skipped because the rejected promise returned by the middleware is  never caught (intentionally as per expected behaviour for the synchronous method)
    // and it logs a "UnhandledPromiseRejectionWarning"
    // @see https://github.com/facebook/jest/issues/6028
    test.skip('throws when a middleware rejects', () => {
      const router = createMockRouter();
      router.use(rejectMiddleware);
      expect(() => router.routeSync(getFoobarRequest)).toThrowError(
        syncMiddlewareReturnedPromiseErrorMessage,
      );
    });

    test('throws when too many redirects are returned', () => {
      const router = createMockRouter();
      router.use(() => ({
        ...getFoobarResponse,
        status: 307,
        headers: {
          location: barfooURL,
        },
      }));
      expect(() => router.routeSync(getFoobarRequest)).toThrowError(
        tooManyRedirectsErrorMessage,
      );
    });

    test('throws when redirects are not permitted but encountered', () => {
      const router = createMockRouter();
      router.use(() => ({
        ...getFoobarResponse,
        status: 307,
        headers: {
          location: barfooURL,
        },
      }));
      expect(() =>
        router.routeSync(getFoobarRequest, {redirect: 'error'}),
      ).toThrowError(redirectsWereNotPermittedErrorMessage);
    });

    test('normalises the request', () => {
      const middleware = jest.fn().mockReturnValue(getFoobarResponse);
      const router = createMockRouter();
      router.use(middleware);
      router.routeSync({url: foobarURL});
      expect(middleware).toBeCalledWith(
        {
          version: '1.1',
          method: 'GET',
          url: foobarURL,
          headers: {},
          body: undefined,
        },
        expect.anything(),
      );
    });

    test('normalises the response', () => {
      const middleware = jest.fn().mockReturnValue({status: 418});
      const router = createMockRouter();
      router.use(middleware);
      expect(router.routeSync({url: foobarURL})).toEqual(
        expect.objectContaining(teapotResponse),
      );
    });

    test('returns when a response is returned', () => {
      const router = createMockRouter();
      router.use(returnMiddleware);
      expect(router.routeSync(getFoobarRequest)).toEqual({
        ...getFoobarResponse,
        redirected: false,
        url: foobarURL,
      });
    });

    test('returns when redirects were followed and a response is returned', () => {
      const router = createMockRouter();
      router.get(barfooURL, {
        status: 307,
        headers: {
          location: foobarURL,
        },
      });
      router.get(foobarURL, getFoobarResponse);
      expect(router.routeSync(getBarfooRequest, {redirect: 'follow'})).toEqual({
        ...getFoobarResponse,
        redirected: true,
        url: foobarURL,
      });
    });

    test('returns when redirects were not followed and a response is returned', () => {
      const router = createMockRouter();
      router.get(barfooURL, {
        status: 307,
        headers: {
          location: foobarURL,
        },
      });
      router.get(foobarURL, getFoobarResponse);
      expect(router.routeSync(getBarfooRequest, {redirect: 'manual'})).toEqual({
        version: '1.1',
        status: 307,
        reason: 'Temporary Redirect',
        headers: {
          location: foobarURL,
        },
        body: undefined,
        redirected: false,
        url: barfooURL,
      });
    });
  });

  describe('.routeAsync()', () => {
    test('rejects when request URL is not absolute', async () => {
      const router = createMockRouter();
      await expect(router.routeAsync({url: '/'})).rejects.toThrowError(
        urlIsNotAbsoluteErrorMessage,
      );
    });

    test('rejects when there are no middlewares', async () => {
      const router = createMockRouter();
      await expect(router.routeAsync(getFoobarRequest)).rejects.toThrowError(
        noResponseErrorMessage,
      );
    });

    test('rejects when there is no response returned', async () => {
      const router = createMockRouter();
      await expect(router.routeAsync(getFoobarRequest)).rejects.toThrowError(
        noResponseErrorMessage,
      );
    });

    test('rejects when a middleware throws', async () => {
      const router = createMockRouter();
      router.use(throwMiddleware);
      await expect(router.routeAsync(getFoobarRequest)).rejects.toThrowError(
        middlewareErrorMessage,
      );
    });

    test('rejects when a middleware rejects', async () => {
      const router = createMockRouter();
      router.use(rejectMiddleware);
      await expect(router.routeAsync(getFoobarRequest)).rejects.toThrowError(
        middlewareErrorMessage,
      );
    });

    test('throws when too many redirects are returned', async () => {
      const router = createMockRouter();
      router.use(() => ({
        ...getFoobarResponse,
        status: 307,
        headers: {
          location: barfooURL,
        },
      }));
      await expect(router.routeAsync(getFoobarRequest)).rejects.toThrowError(
        tooManyRedirectsErrorMessage,
      );
    });

    test('throws when redirects are not permitted but encountered', async () => {
      const router = createMockRouter();
      router.use(() => ({
        ...getFoobarResponse,
        status: 307,
        headers: {
          location: barfooURL,
        },
      }));
      await expect(
        router.routeAsync(getFoobarRequest, {redirect: 'error'}),
      ).rejects.toThrowError(redirectsWereNotPermittedErrorMessage);
    });

    test('normalises the request', async () => {
      const middleware = jest.fn().mockReturnValue(getFoobarResponse);
      const router = createMockRouter();
      router.use(middleware);
      await router.routeAsync({url: foobarURL});
      expect(middleware).toBeCalledWith(
        {
          version: '1.1',
          method: 'GET',
          url: foobarURL,
          headers: {},
          body: undefined,
        },
        expect.anything(),
      );
    });

    test('normalises the response', async () => {
      const middleware = jest.fn().mockReturnValue({status: 418});
      const router = createMockRouter();
      router.use(middleware);
      await expect(router.routeAsync({url: foobarURL})).resolves.toEqual(
        expect.objectContaining(teapotResponse),
      );
    });

    test('resolves when a response is returned', async () => {
      const router = createMockRouter();
      router.use(returnMiddleware);
      await expect(router.routeAsync(getFoobarRequest)).resolves.toEqual(
        expect.objectContaining(getFoobarResponse),
      );
    });

    test('resolves when a response is resolved', async () => {
      const router = createMockRouter();
      router.use(resolveMiddleware);
      await expect(router.routeAsync(getFoobarRequest)).resolves.toEqual(
        expect.objectContaining(getFoobarResponse),
      );
    });

    test('resolves when redirects were followed and a response is returned', async () => {
      const router = createMockRouter();
      router.get(barfooURL, {
        status: 307,
        headers: {
          location: foobarURL,
        },
      });
      router.get(foobarURL, getFoobarResponse);
      await expect(
        router.routeAsync(getBarfooRequest, {redirect: 'follow'}),
      ).resolves.toEqual({
        ...getFoobarResponse,
        redirected: true,
        url: foobarURL,
      });
    });

    test('resolves when redirects were not followed and a response is returned', async () => {
      const router = createMockRouter();
      router.get(barfooURL, {
        status: 307,
        headers: {
          location: foobarURL,
        },
      });
      router.get(foobarURL, getFoobarResponse);
      await expect(
        router.routeAsync(getBarfooRequest, {redirect: 'manual'}),
      ).resolves.toEqual({
        version: '1.1',
        status: 307,
        reason: 'Temporary Redirect',
        headers: {
          location: foobarURL,
        },
        body: undefined,
        redirected: false,
        url: barfooURL,
      });
    });
  });
});
