import {RequestWithParams} from '../types';
import Router from '../router';
import createFetchFunction from './index';

function router() {
  return new Router()
    .get('/api/user/:id', (req: RequestWithParams) => ({
      body: JSON.stringify({
        id: req.params.id,
        name: 'John',
        email: 'john@gmail.com'
      })
    }))
    .post('/api/user', {
      status: 201
    })
    .use(() => ({
      status: 404
    }));
}

describe('createFetchFunction()', () => {
  it('should get', async () => {
    const fetch = createFetchFunction(router());
    const res = await fetch('/api/user/123');
  });

  it('should post', async () => {
    const fetch = createFetchFunction(router());
    const res = await fetch('/api/user', {method: 'post'});
  });
});
