import Router from '@xhr-mock/router';
import {Facade} from './Facade';
import {XRequest as Request} from './Request';

describe('Facade', () => {
  const facade = new Facade();

  beforeEach(() => {
    facade.setup();
    facade.router = new Router()
      .get('/ok', {status: 200})
      .get('/created', {status: 201})
      .get('/headers', {headers: {'content-type': 'text/html'}})
      .get('/text', {body: 'Hello World!'})
      .get('/json', {body: JSON.stringify({msg: 'Hello World!'})});
  });
  afterEach(() => facade.teardown());

  describe('request', () => {
    const handler = jest.fn();

    beforeEach(() => {
      handler.mockReset();
      handler.mockReturnValue({});
      facade.router!.use(handler);
    });

    it('should set the url when passed as a string', async () => {
      await fetch('/foo');

      expect(handler).toBeCalledWith(
        expect.objectContaining({
          url: '/foo',
        }),
        expect.objectContaining({}),
      );
    });

    it('should set the method when passed as an object', async () => {
      await fetch('/foo', {method: 'post'});

      expect(handler).toBeCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/foo',
        }),
        expect.objectContaining({}),
      );
    });

    it('should set the url when passed as a request', async () => {
      await fetch(new Request('/foo'));

      expect(handler).toBeCalledWith(
        expect.objectContaining({
          url: '/foo',
        }),
        expect.objectContaining({}),
      );
    });
  });

  describe('response', () => {
    it('should set the status code', async () => {
      const response = await fetch('/created');
      expect(response.status).toEqual(201);
    });

    it('should set the status message', async () => {
      const response = await fetch('/created');
      expect(response.statusText).toEqual('Created');
    });

    it('should set the headers', async () => {
      const response = await fetch('/headers');
      expect(response.headers.get('content-type')).toEqual('text/html');
    });

    it('should return text when body is a string', async () => {
      const response = await fetch('/text');
      const text = await response.text();
      expect(text).toEqual('Hello World!');
    });

    it('should return JSON when body is a JSON string', async () => {
      const response = await fetch('/json');
      const json = await response.json();
      expect(json).toEqual({msg: 'Hello World!'});
    });
  });
});
