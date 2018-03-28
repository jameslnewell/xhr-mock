import MockRouter from './MockRouter';
import {MockRequest, RequestWithParams, MockResponse} from '../types';

const noop = () => undefined;

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

describe('MockRouter', () => {
  it('should match the callback', () => {
    const router = new MockRouter();
    router.get('/foo/bar', () => res);
    expect(router.routeSync(req)).toEqual(res);
  });

  it('should not match the callback', () => {
    const router = new MockRouter();
    router.post('/bar', () => res);
    expect(() => router.routeSync(req)).toThrow();
  });

  describe('.routeSync()', () => {
    it('should error when there are no callbacks and no response is returned', () => {
      const router = new MockRouter();
      expect(() => router.routeSync(req)).toThrow(/no response/i);
    });

    it('should error when there are callbacks and no response is returned', () => {
      const router = new MockRouter();
      router.use(noop);
      router.use(noop);
      expect(() => router.routeSync(req)).toThrow(/no response/i);
    });

    it('should error when there are callbacks and a response is returned asynchronously', () => {
      const router = new MockRouter();
      router.use(() => Promise.resolve(res));
      expect(() => router.routeSync(req)).toThrow(
        /returned a response asynchronously/i
      );
    });

    it('should return a response when there are callbacks and a response is returned synchronously', () => {
      const router = new MockRouter();
      router.use(() => res);
      expect(router.routeSync(req)).toEqual(res);
    });

    it('should normalise the request', () => {
      expect.assertions(1);
      const req = {method: 'PUT', uri: '/'};
      const router = new MockRouter();
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
      router.routeSync(req);
    });

    it('should normalise the response', () => {
      const req = {method: 'PUT', uri: '/'};
      const router = new MockRouter();
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

    it('should call the before callback', () => {
      expect.assertions(1);
      const req = {uri: '/'};
      const router = new MockRouter();
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
      router.routeSync(req);
    });

    it('should call the after callback', () => {
      expect.assertions(2);
      const req = {uri: '/'};
      const router = new MockRouter();
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
      router.routeSync(req);
    });

    it('should call the error callback', () => {
      expect.assertions(2);
      const req = {uri: '/'};
      const router = new MockRouter();
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
        router.routeSync(req);
      } catch (error) {}
    });
  });

  describe('.routeAsync()', () => {
    it('should error when there are no callbacks and no response is returned', async () => {
      expect.assertions(1);
      const router = new MockRouter();
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
      const router = new MockRouter();
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
      const router = new MockRouter();
      router.use(() => Promise.resolve(res));
      try {
        const res = await router.routeAsync(req);
        expect(res).toEqual(res);
      } catch (error) {}
    });

    it('should return a response when there are callbacks and a response is returned synchronously', async () => {
      expect.assertions(1);
      const router = new MockRouter();
      router.use(() => res);
      try {
        const res = await router.routeAsync(req);
        expect(res).toEqual(res);
      } catch (error) {}
    });

    it('should normalise the request', async () => {
      expect.assertions(1);
      const req = {method: 'PUT', uri: '/'};
      const router = new MockRouter();
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
        const res = await router.routeAsync(req);
      } catch (error) {}
    });

    it('should normalise the response', async () => {
      const req = {method: 'PUT', uri: '/'};
      const router = new MockRouter();
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

    it('should call the before callback', async () => {
      expect.assertions(1);
      const req = {uri: '/'};
      const router = new MockRouter();
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
      await router.routeAsync(req);
    });

    it('should call the after callback', async () => {
      expect.assertions(2);
      const req = {uri: '/'};
      const router = new MockRouter();
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
      await router.routeAsync(req);
    });

    it.only('should call the error callback', async () => {
      expect.assertions(2);
      const req = {uri: '/'};
      const router = new MockRouter();
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
        await router.routeAsync(req);
      } catch (error) {}
    });
  });

  it('should populate the request params', () => {
    const router = new MockRouter();
    router.get('/api/item/:id(\\d+)', (req: RequestWithParams) => {
      expect(req.params).toEqual({
        id: '123'
      });
      return {};
    });
    router.routeSync({uri: '/api/item/123'});
  });
});
