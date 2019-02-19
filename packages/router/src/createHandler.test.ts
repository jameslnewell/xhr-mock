import {MockRequest, MockResponse, MockContextWithSync} from './types';
import {createHandler} from './createHandler';

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

const ctx: MockContextWithSync = {
  sync: false
};

const alwaysReturnsResponseHandler = () => res;

describe('createRouteHandler()', () => {
  it('should match the method', () => {
    expect(
      createHandler('*', '/foo/bar', alwaysReturnsResponseHandler)(
        {
          ...req,
          method: 'get'
        },
        ctx
      )
    ).toEqual(res);
    expect(
      createHandler('get', '/foo/bar', alwaysReturnsResponseHandler)(
        {
          ...req,
          method: 'get'
        },
        ctx
      )
    ).toEqual(res);
    expect(
      createHandler('post', '/foo/bar', alwaysReturnsResponseHandler)(
        {
          ...req,
          method: 'post'
        },
        ctx
      )
    ).toEqual(res);
    expect(
      createHandler('put', '/foo/bar', alwaysReturnsResponseHandler)(
        {
          ...req,
          method: 'put'
        },
        ctx
      )
    ).toEqual(res);
    expect(
      createHandler('patch', '/foo/bar', alwaysReturnsResponseHandler)(
        {
          ...req,
          method: 'patch'
        },
        ctx
      )
    ).toEqual(res);
    expect(
      createHandler('delete', '/foo/bar', alwaysReturnsResponseHandler)(
        {
          ...req,
          method: 'delete'
        },
        ctx
      )
    ).toEqual(res);
  });

  it('should not match the method', () => {
    expect(
      createHandler('options', '/foo/bar', alwaysReturnsResponseHandler)(
        {
          ...req,
          method: 'get'
        },
        ctx
      )
    ).toBeUndefined();
    expect(
      createHandler('head', '/foo/bar', alwaysReturnsResponseHandler)(
        {
          ...req,
          method: 'post'
        },
        ctx
      )
    ).toBeUndefined();
  });

  it('should match the uri', () => {
    expect(createHandler('get', '/foo/bar', alwaysReturnsResponseHandler)(req, ctx)).toEqual(res);
    expect(createHandler('get', '/foo/:bar', alwaysReturnsResponseHandler)(req, ctx)).toEqual(res);
    expect(createHandler('get', /bar/i, alwaysReturnsResponseHandler)(req, ctx)).toEqual(res);
    expect(createHandler('get', 'http://example.com/foo/bar', alwaysReturnsResponseHandler)(req, ctx)).toEqual(res);
  });

  it('should not match the uri', () => {
    expect(createHandler('get', '/foo/baz', alwaysReturnsResponseHandler)(req, ctx)).toBeUndefined();
    expect(createHandler('get', '/bar/:foo', alwaysReturnsResponseHandler)(req, ctx)).toBeUndefined();
    expect(createHandler('get', /abc/i, alwaysReturnsResponseHandler)(req, ctx)).toBeUndefined();
  });

  it('should call callback', () => {
    const cb = jest.fn(alwaysReturnsResponseHandler);
    createHandler('get', '/foo/bar', cb)(req, ctx);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('should return response', () => {
    const res = createHandler('get', '/foo/bar', {
      status: 201
    })(req, ctx);
    expect(res).toEqual({
      status: 201
    });
  });

  it('should populate the request params', () => {
    const res = createHandler('get', '/foo/:thing', req => {
      expect(req).toEqual(
        expect.objectContaining({
          params: {
            thing: 'bar'
          }
        })
      );
      return undefined;
    });
  });

  it('should match the host and port', () => {
    const res = createHandler('get', 'https://localhost:3000/foo/bar', {})(
      {
        ...req,
        headers: {host: 'localhost:3000'}
      },
      {sync: true}
    );
    expect(res).toEqual({});
  });
});
