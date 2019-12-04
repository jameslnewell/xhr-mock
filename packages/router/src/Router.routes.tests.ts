import {createMockRouter} from './__fixtures__/createMockRouter';
const methods: (
  | 'options'
  | 'head'
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete')[] = ['options', 'head', 'get', 'post', 'put', 'patch', 'delete'];

const fooBarURL = 'http://localhost/foo/bar';
const barFooURL = 'http://localhost/bar/foo';

const anyMethodPattern = '*';
const anyURLPattern = /.*/;

const teapotResponse = {
  status: 418,
  reason: `I'm a teapot`,
};

const noMiddlewareError = 'No middleware returned a response for the request.';

describe('Router', () => {
  describe('.use()', () => {
    test('rejects when undefined is returned', async () => {
      const router = createMockRouter();
      router.use(() => undefined);
      await expect(
        router.routeAsync({method: 'foobar', url: fooBarURL}),
      ).rejects.toThrowError(noMiddlewareError);
    });

    test('resolves when a response is returned', async () => {
      const router = createMockRouter();
      router.use(() => teapotResponse);
      await expect(
        router.routeAsync({method: 'foobar', url: fooBarURL}),
      ).resolves.toEqual(expect.objectContaining(teapotResponse));
    });

    methods.forEach(method => {
      describe(method, () => {
        test(`resolves when the request matches the route method and the method is lowercase`, async () => {
          const router = createMockRouter();
          router.use(method, anyURLPattern, teapotResponse);
          await expect(
            router.routeAsync({method: method.toLowerCase(), url: fooBarURL}),
          ).resolves.toEqual(expect.objectContaining(teapotResponse));
        });

        test(`resolves when the request matches the route method and the method is upercase`, async () => {
          const router = createMockRouter();
          router.use(method, anyURLPattern, teapotResponse);
          await expect(
            router.routeAsync({method: method.toUpperCase(), url: fooBarURL}),
          ).resolves.toEqual(expect.objectContaining(teapotResponse));
        });

        test(`rejects when the request does not match the route url`, async () => {
          const router = createMockRouter();
          router.use(method, '/foo/bar', teapotResponse);
          await expect(
            router.routeAsync({method, url: barFooURL}),
          ).rejects.toThrowError(noMiddlewareError);
        });

        test(`resolves when the route url is a string and the request url matches `, async () => {
          const router = createMockRouter();
          router.use(method, '/foo/bar', teapotResponse);
          await expect(
            router.routeAsync({method, url: fooBarURL}),
          ).resolves.toEqual(expect.objectContaining(teapotResponse));
        });

        test(`resolves when the route url is a regexp and the request url matches`, async () => {
          const router = createMockRouter();
          router.use(method, /.*/, teapotResponse);
          await expect(
            router.routeAsync({method, url: fooBarURL}),
          ).resolves.toEqual(expect.objectContaining(teapotResponse));
        });

        test(`resolves when the route url has segments and the request url matches`, async () => {
          const router = createMockRouter();
          router.use(method, '/foo/:id', teapotResponse);
          await expect(
            router.routeAsync({method, url: fooBarURL}),
          ).resolves.toEqual(
            expect.objectContaining({
              ...teapotResponse,
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
        router[method](anyURLPattern, teapotResponse);
        await expect(
          router.routeAsync({method: 'foobar', url: fooBarURL}),
        ).rejects.toThrowError(noMiddlewareError);
      });

      test(`resolves when the request matches the route method and the method is lowercase`, async () => {
        const router = createMockRouter();
        router[method](anyURLPattern, teapotResponse);
        await expect(
          router.routeAsync({method: method.toLowerCase(), url: fooBarURL}),
        ).resolves.toEqual(expect.objectContaining(teapotResponse));
      });

      test(`resolves when the request matches the route method and the method is upercase`, async () => {
        const router = createMockRouter();
        router[method](anyURLPattern, teapotResponse);
        await expect(
          router.routeAsync({method: method.toUpperCase(), url: fooBarURL}),
        ).resolves.toEqual(expect.objectContaining(teapotResponse));
      });

      test(`rejects when the request does not match the route url with hostname`, async () => {
        const router = createMockRouter();
        router[method](fooBarURL, teapotResponse);
        await expect(
          router.routeAsync({method, url: 'http://example.com/foo/bar'}),
        ).rejects.toThrowError(noMiddlewareError);
      });

      test(`rejects when the request does not match the route url with port`, async () => {
        const router = createMockRouter();
        router[method](fooBarURL, teapotResponse);
        await expect(
          router.routeAsync({method, url: 'http://localhost:8888/foo/bar'}),
        ).rejects.toThrowError(noMiddlewareError);
      });

      test(`rejects when the request does not match the route url with path`, async () => {
        const router = createMockRouter();
        router[method]('/foo/bar', teapotResponse);
        await expect(
          router.routeAsync({method, url: barFooURL}),
        ).rejects.toThrowError(noMiddlewareError);
      });

      test(`rejects when the request does not match the route url with querystring`, async () => {
        const router = createMockRouter();
        router[method]('/foo/bar?blah=blah', teapotResponse);
        await expect(
          router.routeAsync({method, url: fooBarURL}),
        ).rejects.toThrowError(noMiddlewareError);
      });

      test(`resolves when the route url is a string and the request url matches with hostname`, async () => {
        const router = createMockRouter();
        router[method](fooBarURL, teapotResponse);
        await expect(
          router.routeAsync({method, url: fooBarURL}),
        ).resolves.toEqual(expect.objectContaining(teapotResponse));
      });

      test(`resolves when the route url is a string and the request url matches with port`, async () => {
        const router = createMockRouter();
        router[method]('http://localhost:8080/foo/bar', teapotResponse);
        await expect(
          router.routeAsync({method, url: 'http://localhost:8080/foo/bar'}),
        ).resolves.toEqual(expect.objectContaining(teapotResponse));
      });

      test(`resolves when the route url is a string and the request url matches with path`, async () => {
        const router = createMockRouter();
        router[method]('/foo/bar', teapotResponse);
        await expect(
          router.routeAsync({method, url: fooBarURL}),
        ).resolves.toEqual(expect.objectContaining(teapotResponse));
      });

      test(`resolves when the route url is a regexp and the request url matches`, async () => {
        const router = createMockRouter();
        router[method](/.*/, teapotResponse);
        await expect(
          router.routeAsync({method, url: fooBarURL}),
        ).resolves.toEqual(expect.objectContaining(teapotResponse));
      });

      test(`resolves when the route url has segments and the request url matches`, async () => {
        const router = createMockRouter();
        router[method]('/foo/:id', teapotResponse);
        await expect(
          router.routeAsync({method, url: fooBarURL}),
        ).resolves.toEqual(
          expect.objectContaining({
            ...teapotResponse,
          }),
        );
      });
    });
  });
});
