import {Router} from './Router';

const methods: (
  | 'options'
  | 'head'
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete')[] = ['options', 'head', 'get', 'post', 'put', 'patch', 'delete'];

const anyMethod = '*';
const anyURL = /.*/;

const teapotResponse = {
  status: 418,
  reason: `I'm a teapot`,
};

const noMiddlewareError = 'No middleware returned a response for the request.';

describe('Router', () => {
  describe('.use()', () => {
    test('rejects when undefined is returned', async () => {
      const router = new Router();
      router.use(() => undefined);
      await expect(router.routeAsync({method: 'foobar'})).rejects.toThrowError(
        noMiddlewareError,
      );
    });

    test('resolves when a response is returned', async () => {
      const router = new Router();
      router.use(() => teapotResponse);
      await expect(router.routeAsync({method: 'foobar'})).resolves.toEqual(
        expect.objectContaining(teapotResponse),
      );
    });

    methods.forEach(method => {
      describe(method, () => {
        test(`resolves when the request matches the route method and the method is lowercase`, async () => {
          const router = new Router();
          router.use(method, anyURL, teapotResponse);
          await expect(
            router.routeAsync({method: method.toLowerCase()}),
          ).resolves.toEqual(expect.objectContaining(teapotResponse));
        });

        test(`resolves when the request matches the route method and the method is upercase`, async () => {
          const router = new Router();
          router.use(method, anyURL, teapotResponse);
          await expect(
            router.routeAsync({method: method.toUpperCase()}),
          ).resolves.toEqual(expect.objectContaining(teapotResponse));
        });

        test(`rejects when the request does not match the route url`, async () => {
          const router = new Router();
          router.use(method, '/foo/bar', teapotResponse);
          await expect(
            router.routeAsync({method, url: '/bar/foo'}),
          ).rejects.toThrowError(
            'No middleware returned a response for the request.',
          );
        });

        test(`rejects when the request does not match the route url`, async () => {
          const router = new Router();
          router.use(method, '/foo/bar', teapotResponse);
          await expect(
            router.routeAsync({method, url: '/bar/foo'}),
          ).rejects.toThrowError(
            'No middleware returned a response for the request.',
          );
        });

        test(`resolves when the route url is a string and the request url matches `, async () => {
          const router = new Router();
          router.use(method, '/foo/bar', teapotResponse);
          await expect(
            router.routeAsync({method, url: '/foo/bar'}),
          ).resolves.toEqual(expect.objectContaining(teapotResponse));
        });

        test(`resolves when the route url is a regexp and the request url matches`, async () => {
          const router = new Router();
          router.use(method, /.*/, teapotResponse);
          await expect(
            router.routeAsync({method, url: '/foo/bar'}),
          ).resolves.toEqual(expect.objectContaining(teapotResponse));
        });

        test(`resolves when the route url has segments and the request url matches`, async () => {
          const router = new Router();
          router.use(method, '/foo/:id', teapotResponse);
          await expect(
            router.routeAsync({method, url: '/foo/bar'}),
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
        const router = new Router();
        router[method](anyURL, teapotResponse);
        await expect(
          router.routeAsync({method: 'foobar'}),
        ).rejects.toThrowError(noMiddlewareError);
      });

      test(`resolves when the request matches the route method and the method is lowercase`, async () => {
        const router = new Router();
        router[method](anyURL, teapotResponse);
        await expect(
          router.routeAsync({method: method.toLowerCase()}),
        ).resolves.toEqual(expect.objectContaining(teapotResponse));
      });

      test(`resolves when the request matches the route method and the method is upercase`, async () => {
        const router = new Router();
        router[method](anyURL, teapotResponse);
        await expect(
          router.routeAsync({method: method.toUpperCase()}),
        ).resolves.toEqual(expect.objectContaining(teapotResponse));
      });

      test(`rejects when the request does not match the route url with hostname`, async () => {
        const router = new Router();
        router[method]('http://localhost/foo/bar', teapotResponse);
        await expect(
          router.routeAsync({method, url: 'http://example.com/foo/bar'}),
        ).rejects.toThrowError(noMiddlewareError);
      });

      test(`rejects when the request does not match the route url with port`, async () => {
        const router = new Router();
        router[method]('http://localhost/foo/bar', teapotResponse);
        await expect(
          router.routeAsync({method, url: 'http://example.com:80/foo/bar'}),
        ).rejects.toThrowError(noMiddlewareError);
      });

      test(`rejects when the request does not match the route url with path`, async () => {
        const router = new Router();
        router[method]('/foo/bar', teapotResponse);
        await expect(
          router.routeAsync({method, url: '/bar/foo'}),
        ).rejects.toThrowError(noMiddlewareError);
      });

      test(`rejects when the request does not match the route url with querystring`, async () => {
        const router = new Router();
        router[method]('/foo/bar?blah=blah', teapotResponse);
        await expect(
          router.routeAsync({method, url: '/foo/bar'}),
        ).rejects.toThrowError(noMiddlewareError);
      });

      test(`resolves when the route url is a string and the request url matches with hostname`, async () => {
        const router = new Router();
        router[method]('http://localhost/foo/bar', teapotResponse);
        await expect(
          router.routeAsync({method, url: 'http://localhost/foo/bar'}),
        ).resolves.toEqual(expect.objectContaining(teapotResponse));
      });

      test(`resolves when the route url is a string and the request url matches with port`, async () => {
        const router = new Router();
        router[method]('http://localhost:8080/foo/bar', teapotResponse);
        await expect(
          router.routeAsync({method, url: 'http://localhost:8080/foo/bar'}),
        ).resolves.toEqual(expect.objectContaining(teapotResponse));
      });

      test(`resolves when the route url is a string and the request url matches with path`, async () => {
        const router = new Router();
        router[method]('/foo/bar', teapotResponse);
        await expect(
          router.routeAsync({method, url: '/foo/bar'}),
        ).resolves.toEqual(expect.objectContaining(teapotResponse));
      });

      test(`resolves when the route url is a regexp and the request url matches`, async () => {
        const router = new Router();
        router[method](/.*/, teapotResponse);
        await expect(
          router.routeAsync({method, url: '/foo/bar'}),
        ).resolves.toEqual(expect.objectContaining(teapotResponse));
      });

      test(`resolves when the route url has segments and the request url matches`, async () => {
        const router = new Router();
        router[method]('/foo/:id', teapotResponse);
        await expect(
          router.routeAsync({method, url: '/foo/bar'}),
        ).resolves.toEqual(
          expect.objectContaining({
            ...teapotResponse,
          }),
        );
      });
    });
  });
});
