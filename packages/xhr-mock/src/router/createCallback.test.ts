import createCallback from './createCallback';

const req = {
  version: '1.1',
  method: 'get',
  path: '/foo/bar',
  query: {},
  params: {},
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

const callback = () => res;

describe('createCallback()', () => {
  it('should match the method', () => {
    expect(
      createCallback('*', '/foo/bar', callback)({...req, method: 'get'})
    ).toEqual(res);
    expect(
      createCallback('get', '/foo/bar', callback)({...req, method: 'get'})
    ).toEqual(res);
    expect(
      createCallback('post', '/foo/bar', callback)({...req, method: 'post'})
    ).toEqual(res);
    expect(
      createCallback('put', '/foo/bar', callback)({...req, method: 'put'})
    ).toEqual(res);
    expect(
      createCallback('patch', '/foo/bar', callback)({...req, method: 'patch'})
    ).toEqual(res);
    expect(
      createCallback('delete', '/foo/bar', callback)({...req, method: 'delete'})
    ).toEqual(res);
  });

  it('should not match the method', () => {
    expect(
      createCallback('options', '/foo/bar', callback)({...req, method: 'get'})
    ).toBeUndefined();
    expect(
      createCallback('head', '/foo/bar', callback)({...req, method: 'post'})
    ).toBeUndefined();
  });

  it('should match the path', () => {
    expect(createCallback('*', '/foo/bar', callback)(req)).toEqual(res);
    expect(createCallback('*', '/foo/:bar', callback)(req)).toEqual(res);
    expect(createCallback('*', /bar/i, callback)(req)).toEqual(res);
  });

  it('should not match the path', () => {
    expect(createCallback('*', '/foo/baz', callback)(req)).toBeUndefined();
    expect(createCallback('*', '/bar/:foo', callback)(req)).toBeUndefined();
    expect(createCallback('*', /abc/i, callback)(req)).toBeUndefined();
  });

  it('should call callback', () => {
    const cb = jest.fn(callback);
    createCallback('*', '/foo/bar', cb)(req);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('should return response', () => {
    const res = createCallback('*', '/foo/bar', {
      status: 201
    })(req);
    expect(res).toEqual({
      status: 201
    });
  });
});
