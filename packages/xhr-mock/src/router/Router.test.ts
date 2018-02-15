import Router from './Router';

const noop = () => undefined;

const req = {
  version: '1.1',
  method: 'get',
  path: '/foo/bar',
  headers: {},
  body: undefined
};

const res = {
  version: '1.1',
  status: 200,
  reason: 'OK',
  headers: {},
  body: undefined
};

describe('Router', () => {
  it('should match the callback', () => {
    const router = new Router();
    router.get('/foo/bar', () => res);
    expect(router.routeSync(req)).toEqual(res);
  });

  it('should not match the callback', () => {
    const router = new Router();
    router.post('/bar', () => res);
    expect(() => router.routeSync(req)).toThrow();
  });

  describe('.routeSync()', () => {
    it('should error when there are no callbacks and no response is returned', () => {
      const router = new Router();
      expect(() => router.routeSync(req)).toThrow(/no response/i);
    });

    it('should error when there are callbacks and no response is returned', () => {
      const router = new Router();
      router.use(noop);
      router.use(noop);
      expect(() => router.routeSync(req)).toThrow(/no response/i);
    });

    it('should error when there are callbacks and a response is returned asynchronously', () => {
      const router = new Router();
      router.use(() => Promise.resolve(res));
      expect(() => router.routeSync(req)).toThrow(
        /returned a response asynchronously/i
      );
    });

    it('should return a response when there are callbacks and a response is returned synchronously', () => {
      const router = new Router();
      router.use(() => res);
      expect(router.routeSync(req)).toEqual(res);
    });

    it('should normalise the request', () => {
      expect.assertions(1);
      const req = {method: 'PUT', path: '/'};
      const router = new Router();
      router.put('/', req => {
        expect(req).toEqual({
          version: '1.1',
          method: 'put',
          path: '/',
          headers: {},
          body: undefined
        });
        return {};
      });
      router.routeSync(req);
    });

    it('should normalise the response', () => {
      const req = {method: 'PUT', path: '/'};
      const router = new Router();
      router.put('/', req => {
        return {status: 201};
      });
      expect(router.routeSync(req)).toEqual({
        version: '1.1',
        status: 201,
        reason: 'Created',
        headers: {},
        body: undefined
      });
    });
  });

  describe('.routeAsync()', () => {
    it('should error when there are no callbacks and no response is returned', async () => {
      expect.assertions(1);
      const router = new Router();
      try {
        await router.routeAsync(req);
      } catch (error) {
        expect(error).toEqual(
          expect.objectContaining({
            message: expect.stringMatching(/no response/i)
          })
        );
      }
    });

    it('should error when there are callbacks and no response is returned', async () => {
      expect.assertions(1);
      const router = new Router();
      router.use(noop);
      router.use(noop);
      try {
        await router.routeAsync(req);
      } catch (error) {
        expect(error).toEqual(
          expect.objectContaining({
            message: expect.stringMatching(/no response/i)
          })
        );
      }
    });

    it('should return a response when there are callbacks and a response is returned asynchronously', async () => {
      expect.assertions(1);
      const router = new Router();
      router.use(() => Promise.resolve(res));
      try {
        const res = await router.routeAsync(req);
        expect(res).toEqual(res);
      } catch (error) {}
    });

    it('should return a response when there are callbacks and a response is returned synchronously', async () => {
      expect.assertions(1);
      const router = new Router();
      router.use(() => res);
      try {
        const res = await router.routeAsync(req);
        expect(res).toEqual(res);
      } catch (error) {}
    });

    it('should normalise the request', async () => {
      expect.assertions(1);
      const req = {method: 'PUT', path: '/'};
      const router = new Router();
      router.put('/', req => {
        expect(req).toEqual({
          version: '1.1',
          method: 'put',
          path: '/',
          query: {},
          params: {},
          headers: {},
          body: undefined
        });
        return {};
      });
      try {
        const res = await router.routeAsync(req);
      } catch (error) {}
    });

    it('should normalise the response', async () => {
      const req = {method: 'PUT', path: '/'};
      const router = new Router();
      router.put('/', req => {
        return {status: 201};
      });
      try {
        const res = await router.routeAsync(req);
        expect(res).toEqual({
          version: '1.1',
          status: 201,
          reason: 'Created',
          headers: {},
          body: undefined
        });
      } catch (error) {}
    });
  });

  it.only('should populate params', () => {
    const router = new Router();
    router.get('/api/item/:id(\\d+)', req => {
      expect(req.params).toEqual({
        id: '123'
      });
      console.log(req.params);
      if (req.params.id) {
        return {
          status: 201
        };
      }
      return {status: 500};
    });
    const res = router.routeSync({path: '/api/item/123'});
    console.log(res);
  });
});
