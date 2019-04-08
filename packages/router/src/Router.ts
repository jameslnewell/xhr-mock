import mitt = require('mitt');
import {MethodPattern, PathPattern, Request, Response, Context, Middleware, Mode} from './types';
import {RouterError} from './RouterError';
import {createMiddleware} from './createMiddleware';
import {isPromise} from './isPromise';
import {normaliseRequest, normaliseResponse} from './normalise';
import {defaultErrorListener} from './defaultErrorListener';

export class Router<C extends {} = {}> {
  private emitter: mitt.Emitter = new mitt();
  private middleware: Array<Middleware<C>> = [];

  public constructor() {
    // add a default event handler until the user registers their own
    this.emitter.on('error', defaultErrorListener);
  }

  public on(type: 'before', listener: (data: {request: Request; context: Context<C>}) => void): Router<C>;
  public on(
    type: 'after',
    listener: (data: {request: Request; response: Response; context: Context<C>}) => void
  ): Router<C>;
  public on(type: 'error', listener: (data: {request: Request; context: Context<C>; error: any}) => void): Router<C>;
  public on(
    type: 'before' | 'after' | 'error',
    listener:
      | (
          | ((data: {request: Request; context: Context<C>}) => void)
          | ((data: {request: Request; response: Response; context: Context<C>}) => void))
      | ((data: {request: Request; context: Context<C>; error: any}) => void)
  ): Router<C> {
    this.emitter.on(type, listener);
    if (type === 'error') {
      this.emitter.off('error', defaultErrorListener);
    }
    return this;
  }

  public off(type: 'before', listener: (data: {request: Request; context: Context<C>}) => void): Router<C>;
  public off(
    type: 'after',
    listener: (data: {request: Request; response: Response; context: Context<C>}) => void
  ): Router<C>;
  public off(type: 'error', listener: (data: {request: Request; context: Context<C>; error: any}) => void): Router<C>;
  public off(
    type: 'before' | 'after' | 'error',
    listener:
      | (
          | ((data: {request: Request; context: Context<C>}) => void)
          | ((data: {request: Request; response: Response; context: Context<C>}) => void))
      | ((data: {request: Request; context: Context<C>; error: any}) => void)
  ): Router<C> {
    this.emitter.off(type, listener);
    return this;
  }

  public use(middleware: Middleware<C>): Router<C>;
  public use(method: MethodPattern, path: PathPattern, middleware: Middleware<C> | Partial<Response>): Router<C>;
  public use(
    methodOrMiddleware: MethodPattern | Middleware<C>,
    path?: PathPattern,
    middlewareOrResponse?: Middleware<C> | Partial<Response>
  ): Router<C> {
    if (typeof methodOrMiddleware === 'function') {
      this.middleware.push(methodOrMiddleware);
    } else if (path && middlewareOrResponse) {
      this.middleware.push(createMiddleware(methodOrMiddleware, path, middlewareOrResponse));
    } else {
      throw new TypeError('Invalid parameters');
    }
    return this;
  }

  public options(path: PathPattern, middlewareOrResponse: Middleware<C> | Partial<Response>): Router<C> {
    this.use('options', path, middlewareOrResponse);
    return this;
  }

  public head(path: PathPattern, middlewareOrResponse: Middleware<C> | Partial<Response>): Router<C> {
    this.use('head', path, middlewareOrResponse);
    return this;
  }

  public get(path: PathPattern, middlewareOrResponse: Middleware<C> | Partial<Response>): Router<C> {
    this.use('get', path, middlewareOrResponse);
    return this;
  }

  public post(path: PathPattern, middlewareOrResponse: Middleware<C> | Partial<Response>): Router<C> {
    this.use('post', path, middlewareOrResponse);
    return this;
  }

  public put(path: PathPattern, middlewareOrResponse: Middleware<C> | Partial<Response>): Router<C> {
    this.use('put', path, middlewareOrResponse);
    return this;
  }

  public patch(path: PathPattern, middlewareOrResponse: Middleware<C> | Partial<Response>): Router<C> {
    this.use('patch', path, middlewareOrResponse);
    return this;
  }

  public delete(path: PathPattern, middlewareOrResponse: Middleware<C> | Partial<Response>): Router<C> {
    this.use('delete', path, middlewareOrResponse);
    return this;
  }

  private handleSync(request: Request, context: Context<C>): Response {
    this.emitter.emit('before', {request, context});
    try {
      for (const middleware of this.middleware) {
        const response = middleware(request, context);
        if (!response) {
          continue;
        }
        if (isPromise(response)) {
          throw new RouterError(
            'A middleware returned a response asynchronously while the request was being handled synchronously.'
          );
        }
        const normalisedResponse = normaliseResponse(response);
        this.emitter.emit('after', {
          request,
          response: normalisedResponse,
          context
        });
        return normalisedResponse;
      }
      throw new RouterError('No middleware returned a response for the request.');
    } catch (error) {
      this.emitter.emit('error', {
        request,
        error,
        context
      });
      throw error;
    }
  }

  private async handleAsync(request: Request, context: Context<C>): Promise<Response> {
    this.emitter.emit('before', {request, context});
    try {
      for (const middleware of this.middleware) {
        const response = await middleware(request, context);
        if (!response) {
          continue;
        }
        const normalisedResponse = normaliseResponse(response);
        this.emitter.emit('after', {
          request,
          response: normalisedResponse,
          context
        });
        return normalisedResponse;
      }
      throw new RouterError('No middleware returned a response for the request.');
    } catch (error) {
      this.emitter.emit('error', {
        request,
        error,
        context
      });
      throw error;
    }
  }

  public handle(mode: Mode.SYNC, request: Partial<Request>, context: C & Partial<Context<C>>): Response;
  public handle(mode: Mode.ASYNC, request: Partial<Request>, context: C & Partial<Context<C>>): Promise<Response>;
  public handle(mode: Mode, request: Partial<Request>, context: C & Partial<Context<C>>): Response | Promise<Response> {
    const normalisedRequest = normaliseRequest(request);
    if (mode === Mode.SYNC) {
      const normalisedContext = {...context, mode};
      return this.handleSync(normalisedRequest, normalisedContext);
    } else {
      const normalisedContext = {...context, mode};
      return this.handleAsync(normalisedRequest, normalisedContext);
    }
  }
}
