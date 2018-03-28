import createHandler from './createRouteHandler';
import {Request, Response} from '../types';

const req: Request = {
  version: '1.1',
  method: 'get',
  uri: '/foo/bar',
  headers: {},
  body: undefined
};

const res: Response = {
  version: '1.1',
  status: 200,
  reason: 'OK',
  headers: {},
  body: undefined
};

const alwaysReturnsResponseHandler = () => res;

describe('createRouteHandler()', () => {
  it('should match the method', () => {
    expect(
      createHandler('*', '/foo/bar', alwaysReturnsResponseHandler)({
        ...req,
        method: 'get'
      })
    ).toEqual(res);
    expect(
      createHandler('get', '/foo/bar', alwaysReturnsResponseHandler)({
        ...req,
        method: 'get'
      })
    ).toEqual(res);
    expect(
      createHandler('post', '/foo/bar', alwaysReturnsResponseHandler)({
        ...req,
        method: 'post'
      })
    ).toEqual(res);
    expect(
      createHandler('put', '/foo/bar', alwaysReturnsResponseHandler)({
        ...req,
        method: 'put'
      })
    ).toEqual(res);
    expect(
      createHandler('patch', '/foo/bar', alwaysReturnsResponseHandler)({
        ...req,
        method: 'patch'
      })
    ).toEqual(res);
    expect(
      createHandler('delete', '/foo/bar', alwaysReturnsResponseHandler)({
        ...req,
        method: 'delete'
      })
    ).toEqual(res);
  });

  it('should not match the method', () => {
    expect(
      createHandler('options', '/foo/bar', alwaysReturnsResponseHandler)({
        ...req,
        method: 'get'
      })
    ).toBeUndefined();
    expect(
      createHandler('head', '/foo/bar', alwaysReturnsResponseHandler)({
        ...req,
        method: 'post'
      })
    ).toBeUndefined();
  });

  it('should match the uri', () => {
    expect(
      createHandler('*', '/foo/bar', alwaysReturnsResponseHandler)(req)
    ).toEqual(res);
    expect(
      createHandler('*', '/foo/:bar', alwaysReturnsResponseHandler)(req)
    ).toEqual(res);
    expect(
      createHandler('*', /bar/i, alwaysReturnsResponseHandler)(req)
    ).toEqual(res);
  });

  it('should not match the uri', () => {
    expect(
      createHandler('*', '/foo/baz', alwaysReturnsResponseHandler)(req)
    ).toBeUndefined();
    expect(
      createHandler('*', '/bar/:foo', alwaysReturnsResponseHandler)(req)
    ).toBeUndefined();
    expect(
      createHandler('*', /abc/i, alwaysReturnsResponseHandler)(req)
    ).toBeUndefined();
  });

  it('should call callback', () => {
    const cb = jest.fn(alwaysReturnsResponseHandler);
    createHandler('*', '/foo/bar', cb)(req);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('should return response', () => {
    const res = createHandler('*', '/foo/bar', {
      status: 201
    })(req);
    expect(res).toEqual({
      status: 201
    });
  });

  it('should populate the request params', () => {
    const res = createHandler('*', '/foo/:thing', req => {
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
    const res = createHandler('*', 'https://localhost:3000/foo/bar', {})(
      {
        ...req,
        headers: {host: 'localhost:3000'}
      },
      {async: true}
    );
    expect(res).toEqual({});
  });

  it.skip('should not match the host and port', () => {
    const res = createHandler('*', 'https://localhost:3000/foo/bar', {})(
      {
        ...req,
        headers: {host: 'localhost:8080'}
      },
      {async: true}
    );
    expect(res).toBeUndefined();
  });
});
