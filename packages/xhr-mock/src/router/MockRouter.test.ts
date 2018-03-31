import {
  MockRequest,
  MockRequestWithParams,
  MockResponse,
  MockContext
} from './types';
import {MockRouter} from './MockRouter';

const noop = () => undefined;

const createMockRouter = () => {
  const router = new MockRouter();
  router.after(noop);
  router.error(noop);
  return router;
};

const req: MockRequest = {
  version: '1.1',
  method: 'get',
  uri: '/foo/bar',
  headers: {},
  body: undefined
};

const res: MockResponse = {
  version: '1.1',
  status: 200,
  reason: 'OK',
  headers: {},
  body: undefined
};

const ctx: MockContext = {
  sync: false
};

describe('MockRouter', () => {
  it('should match the handler', () => {
    const router = createMockRouter();
    router.get('/foo/bar', () => res);
    expect(router.routeSync(req, ctx)).toEqual(res);
  });

  it('should not match the handler', () => {
    const router = createMockRouter();
    router.post('/bar', () => res);
    expect(() => router.routeSync(req, ctx)).toThrow();
  });

  describe('.routeSync()', () => {
    it('should error when there are no handlers and no response is returned', () => {
      const router = createMockRouter();
      expect(() => router.routeSync(req, ctx)).toThrow(
        /No handler returned a response/i
      );
    });

    it('should error when there are handlers and no response is returned', () => {
      const router = createMockRouter();
      router.use(noop);
      router.use(noop);
      expect(() => router.routeSync(req, ctx)).toThrow(
        /No handler returned a response/i
      );
    });

    it('should error when there are handlers and a response is returned asynchronously', () => {
      const router = createMockRouter();
      router.use(() => Promise.resolve(res));
      expect(() => router.routeSync(req, ctx)).toThrow(
        /returned a response asynchronously/i
      );
    });

    it('should return a response when there are handlers and a response is returned synchronously', () => {
      const router = createMockRouter();
      router.use(() => res);
      expect(router.routeSync(req, ctx)).toEqual(res);
    });

    it('should normalise the request', () => {
      expect.assertions(1);
      const req = {method: 'PUT', uri: '/'};
      const router = createMockRouter();
      router.put('/', req => {
        expect(req).toEqual({
          version: '1.1',
          method: 'PUT',
          uri: '/',
          params: {},
          headers: {},
          body: undefined
        });
        return {};
      });
      router.routeSync(req, ctx);
    });

    it('should normalise the response', () => {
      const req = {method: 'PUT', uri: '/'};
      const router = createMockRouter();
      router.put('/', req => {
        return {status: 201};
      });
      expect(router.routeSync(req, ctx)).toEqual({
        version: '1.1',
        status: 201,
        reason: 'Created',
        headers: {},
        body: undefined
      });
    });

    it('should call the before callback', () => {
      expect.assertions(1);
      const req = {uri: '/'};
      const router = createMockRouter();
      router.before(({req}) => {
        expect(req).toEqual({
          version: '1.1',
          method: 'GET',
          uri: '/',
          headers: {},
          body: undefined
        });
      });
      router.get('/', {});
      router.routeSync(req, ctx);
    });

    it('should call the after callback', () => {
      expect.assertions(2);
      const req = {uri: '/'};
      const router = createMockRouter();
      router.after(({req, res}) => {
        expect(req).toEqual({
          version: '1.1',
          method: 'GET',
          uri: '/',
          headers: {},
          body: undefined
        });
        expect(res).toEqual({
          version: '1.1',
          status: 201,
          reason: 'Created',
          headers: {},
          body: undefined
        });
      });
      router.get('/', {status: 201});
      router.routeSync(req, ctx);
    });

    it('should call the error callback', () => {
      expect.assertions(2);
      const req = {uri: '/'};
      const router = createMockRouter();
      router.error(({req, err}) => {
        expect(req).toEqual({
          version: '1.1',
          method: 'GET',
          uri: '/',
          headers: {},
          body: undefined
        });
        expect(err.message).toMatch('Oops');
      });
      router.get('/', () => {
        throw new Error('Oops');
      });
      try {
        router.routeSync(req, ctx);
      } catch (error) {}
    });
  });

  describe('.routeAsync()', () => {
    it('should error when there are no handlers and no response is returned', async () => {
      expect.assertions(1);
      const router = createMockRouter();
      try {
        await router.routeAsync(req, ctx);
      } catch (error) {
        expect(error).toEqual(
          expect.objectContaining({
            message: expect.stringMatching(/No handler returned a response/i)
          })
        );
      }
    });

    it('should error when there are handlers and no response is returned', async () => {
      expect.assertions(1);
      const router = createMockRouter();
      router.use(noop);
      router.use(noop);
      try {
        await router.routeAsync(req, ctx);
      } catch (error) {
        expect(error).toEqual(
          expect.objectContaining({
            message: expect.stringMatching(/No handler returned a response/i)
          })
        );
      }
    });

    it('should return a response when there are handlers and a response is returned asynchronously', async () => {
      expect.assertions(1);
      const router = createMockRouter();
      router.use(() => Promise.resolve(res));
      try {
        const res = await router.routeAsync(req, ctx);
        expect(res).toEqual(res);
      } catch (error) {}
    });

    it('should return a response when there are handlers and a response is returned synchronously', async () => {
      expect.assertions(1);
      const router = createMockRouter();
      router.use(() => res);
      try {
        const res = await router.routeAsync(req, ctx);
        expect(res).toEqual(res);
      } catch (error) {}
    });

    it('should normalise the request', async () => {
      expect.assertions(1);
      const req = {method: 'PUT', uri: '/'};
      const router = createMockRouter();
      router.put('/', req => {
        expect(req).toEqual({
          version: '1.1',
          method: 'put',
          uri: '/',
          query: {},
          params: {},
          headers: {},
          body: undefined
        });
        return {};
      });
      try {
        const res = await router.routeAsync(req, ctx);
      } catch (error) {}
    });

    it('should normalise the response', async () => {
      const req = {method: 'PUT', uri: '/'};
      const router = createMockRouter();
      router.put('/', req => {
        return {status: 201};
      });
      try {
        const res = await router.routeAsync(req, ctx);
        expect(res).toEqual({
          version: '1.1',
          status: 201,
          reason: 'Created',
          headers: {},
          body: undefined
        });
      } catch (error) {}
    });

    it('should call the before callback', async () => {
      expect.assertions(1);
      const req = {uri: '/'};
      const router = createMockRouter();
      router.before(({req}) => {
        expect(req).toEqual({
          version: '1.1',
          method: 'GET',
          uri: '/',
          headers: {},
          body: undefined
        });
      });
      router.get('/', {});
      await router.routeAsync(req, ctx);
    });

    it('should call the after callback', async () => {
      expect.assertions(2);
      const req = {uri: '/'};
      const router = createMockRouter();
      router.after(({req, res}) => {
        expect(req).toEqual({
          version: '1.1',
          method: 'GET',
          uri: '/',
          headers: {},
          body: undefined
        });
        expect(res).toEqual({
          version: '1.1',
          status: 201,
          reason: 'Created',
          headers: {},
          body: undefined
        });
      });
      router.get('/', {status: 201});
      await router.routeAsync(req, ctx);
    });

    it('should call the error callback', async () => {
      expect.assertions(2);
      const req = {uri: '/'};
      const router = createMockRouter();
      router.error(({req, err}) => {
        expect(req).toEqual({
          version: '1.1',
          method: 'GET',
          uri: '/',
          headers: {},
          body: undefined
        });
        expect(err).toEqual(
          expect.objectContaining({
            message: expect.stringContaining('Oops')
          })
        );
      });
      router.get('/', () => Promise.reject(new Error('Oops')));
      try {
        await router.routeAsync(req, ctx);
      } catch (error) {}
    });
  });

  it('should populate the request params', () => {
    const router = createMockRouter();
    router.get('/api/item/:id([0-9]+)', (req: MockRequestWithParams) => {
      expect(req.params).toEqual({
        id: '123'
      });
      return {};
    });
    router.routeSync({uri: '/api/item/123'}, ctx);
  });

  it('should clear the before callback');
  it('should clear the after callback');
  it('should clear the error callback');
  it('should clear the handlers');
});
