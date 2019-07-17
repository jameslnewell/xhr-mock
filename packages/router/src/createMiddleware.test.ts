// tslint:disable no-shadowed-variable
import {Request, Response, Context, Mode} from './types';
import {createMiddleware} from './createMiddleware';

const defaultRequest: Request = {
  version: '1.1',
  method: 'get',
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

describe('createMiddlewareHandler()', () => {
  ['get', 'post', 'put', 'patch', 'delete'].forEach(method => {
    it(`should match * to ${method}`, () => {
      expect(
        createMiddleware('*', '/foo/bar', defaultResponse)(
          {
            ...defaultRequest,
            method,
          },
          defaultContext,
        ),
      ).toEqual(defaultResponse);
    });
    it(`should match ${method} to ${method}`, () => {
      expect(
        createMiddleware(method, '/foo/bar', defaultResponse)(
          {
            ...defaultRequest,
            method,
          },
          defaultContext,
        ),
      ).toEqual(defaultResponse);
    });
  });

  it('should not match the method', () => {
    expect(
      createMiddleware('get', '/foo/bar', defaultResponse)(
        {
          ...defaultRequest,
          method: 'post',
        },
        defaultContext,
      ),
    ).toBeUndefined();
    expect(
      createMiddleware('post', '/foo/bar', defaultResponse)(
        {
          ...defaultRequest,
          method: 'put',
        },
        defaultContext,
      ),
    ).toBeUndefined();
  });

  it('should match the path', () => {
    expect(
      createMiddleware('get', '/foo/bar', defaultResponse)(
        defaultRequest,
        defaultContext,
      ),
    ).toEqual(defaultResponse);
    expect(
      createMiddleware('get', '/foo/:bar', defaultResponse)(
        defaultRequest,
        defaultContext,
      ),
    ).toEqual(defaultResponse);
    expect(
      createMiddleware('get', /bar/i, defaultResponse)(
        defaultRequest,
        defaultContext,
      ),
    ).toEqual(defaultResponse);
  });

  it('should not match the path', () => {
    expect(
      createMiddleware('get', '/foo/baz', defaultResponse)(
        defaultRequest,
        defaultContext,
      ),
    ).toBeUndefined();
    expect(
      createMiddleware('get', '/bar/:foo', defaultResponse)(
        defaultRequest,
        defaultContext,
      ),
    ).toBeUndefined();
    expect(
      createMiddleware('get', /abc/i, defaultResponse)(
        defaultRequest,
        defaultContext,
      ),
    ).toBeUndefined();
  });

  it('should call the middleware', () => {
    const middleware = jest.fn(() => defaultResponse);
    createMiddleware('get', '/foo/bar', middleware)(
      defaultRequest,
      defaultContext,
    );
    expect(middleware).toHaveBeenCalledWith(defaultRequest, defaultContext);
  });

  it('should populate the request with parameters from the path', () => {
    expect.assertions(1);
    createMiddleware('get', '/foo/:thing', req => {
      expect(req).toEqual(
        expect.objectContaining({
          params: {
            thing: 'bar',
          },
        }),
      );
      return undefined;
    })(defaultRequest, defaultContext);
  });

  it('should match the path when when the pattern is absolute', () => {
    const response = createMiddleware(
      'get',
      'https://localhost:3000/foo/bar',
      defaultResponse,
    )(
      {
        ...defaultRequest,
        headers: {host: 'localhost:3000'},
      },
      defaultContext,
    );
    expect(response).toEqual(defaultResponse);
  });

  it('should not match the path when the pattern is absolute', () => {
    const response = createMiddleware(
      'get',
      'https://localhost:3000/foo/bar',
      defaultResponse,
    )(
      {
        ...defaultRequest,
        headers: {host: 'www.example.com'},
      },
      defaultContext,
    );
    expect(response).toBeUndefined();
  });

  it('should return response', () => {
    const response = createMiddleware('get', '/foo/bar', {
      status: 201,
    })(defaultRequest, defaultContext);
    expect(response).toEqual({
      status: 201,
    });
  });
});
