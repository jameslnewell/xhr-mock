/* eslint-disable @typescript-eslint/no-explicit-any */
import mitt from 'mitt';
import isAbsoluteURL from 'is-absolute-url';
import {
  MethodPattern,
  URLPattern,
  Request,
  Response,
  Context,
  Middleware,
  RouteOptions,
  RouteResult,
  BeforeEvent,
  AfterEvent,
  ErrorEvent,
  RequestWithParameters,
  RouterError,
} from './types';
import {defaultErrorListener} from './utilities/defaultErrorListener';
import {defaultAfterListener} from './utilities/defaultAfterListener';
import {createMiddleware} from './utilities/createMiddleware';
import {normaliseRequest, normaliseContext} from './utilities/normalise';
import {routeSync} from './utilities/routeSync';
import {routeAsync} from './utilities/routeAsync';
import {isRedirect} from './utilities/isRedirect';

export class Router {
  private emitter: mitt.Emitter = mitt();
  private middleware: Middleware[] = [];

  constructor() {
    // register a default event handler until the user registers their own to avoid emitting logs
    this.emitter.on('after', defaultAfterListener);
    this.emitter.on('error', defaultErrorListener);
  }

  private emitBeforeEvent(request: Request, context: Context): void {
    this.emitter.emit('before', {
      request,
      context,
    });
  }

  private emitAfterEvent(
    request: Request,
    response: Response,
    context: Context,
  ): void {
    this.emitter.emit('after', {
      request,
      response,
      context,
    });
  }

  private emitErrorEvent(request: Request, error: any, context: Context): void {
    this.emitter.emit('error', {
      request,
      error,
      context,
    });
  }

  public on(type: 'before', listener: (data: BeforeEvent) => void): Router;
  public on(type: 'after', listener: (data: AfterEvent) => void): Router;
  public on(type: 'error', listener: (data: ErrorEvent) => void): Router;
  public on(
    type: 'before' | 'after' | 'error',
    listener:
      | ((data: BeforeEvent) => void)
      | ((data: AfterEvent) => void)
      | ((data: ErrorEvent) => void),
  ): Router {
    this.emitter.on(type, listener);
    // remove the default listeners whenever the user adds their own
    if (type === 'after') {
      this.emitter.off('after', defaultAfterListener);
    }
    if (type === 'error') {
      this.emitter.off('error', defaultErrorListener);
    }
    return this;
  }

  public off(type: 'before', listener: (data: BeforeEvent) => void): Router;
  public off(type: 'after', listener: (data: AfterEvent) => void): Router;
  public off(type: 'error', listener: (data: ErrorEvent) => void): Router;
  public off(
    type: 'before' | 'after' | 'error',
    listener:
      | ((data: BeforeEvent) => void)
      | ((data: AfterEvent) => void)
      | ((data: ErrorEvent) => void),
  ): Router {
    this.emitter.off(type, listener);
    return this;
  }

  public use(middleware: Middleware): Router;
  public use(
    method: MethodPattern,
    url: URLPattern,
    middlewareOrResponse: Middleware<RequestWithParameters> | Partial<Response>,
  ): Router;
  public use(
    methodOrMiddleware: MethodPattern | Middleware,
    url?: URLPattern,
    middlewareOrResponse?:
      | Middleware<RequestWithParameters>
      | Partial<Response>,
  ): Router {
    if (typeof methodOrMiddleware === 'function') {
      this.middleware.push(methodOrMiddleware);
    } else if (url && middlewareOrResponse) {
      this.middleware.push(
        createMiddleware(methodOrMiddleware, url, middlewareOrResponse),
      );
    } else {
      throw new TypeError('Invalid arguments.');
    }
    return this;
  }

  public all(
    url: URLPattern,
    middlewareOrResponse: Middleware<RequestWithParameters> | Partial<Response>,
  ): Router {
    this.use('*', url, middlewareOrResponse);
    return this;
  }

  public options(
    url: URLPattern,
    middlewareOrResponse: Middleware<RequestWithParameters> | Partial<Response>,
  ): Router {
    this.use('options', url, middlewareOrResponse);
    return this;
  }

  public head(
    url: URLPattern,
    middlewareOrResponse: Middleware<RequestWithParameters> | Partial<Response>,
  ): Router {
    this.use('head', url, middlewareOrResponse);
    return this;
  }

  public get(
    url: URLPattern,
    middlewareOrResponse: Middleware<RequestWithParameters> | Partial<Response>,
  ): Router {
    this.use('get', url, middlewareOrResponse);
    return this;
  }

  public post(
    url: URLPattern,
    middlewareOrResponse: Middleware<RequestWithParameters> | Partial<Response>,
  ): Router {
    this.use('post', url, middlewareOrResponse);
    return this;
  }

  public put(
    url: URLPattern,
    middlewareOrResponse: Middleware<RequestWithParameters> | Partial<Response>,
  ): Router {
    this.use('put', url, middlewareOrResponse);
    return this;
  }

  public patch(
    url: URLPattern,
    middlewareOrResponse: Middleware<RequestWithParameters> | Partial<Response>,
  ): Router {
    this.use('patch', url, middlewareOrResponse);
    return this;
  }

  public delete(
    url: URLPattern,
    middlewareOrResponse: Middleware<RequestWithParameters> | Partial<Response>,
  ): Router {
    this.use('delete', url, middlewareOrResponse);
    return this;
  }

  public routeSync(
    request: Partial<Request>,
    options: RouteOptions = {redirect: 'follow'},
  ): RouteResult {
    const normalisedRequest = normaliseRequest(request);
    const normalisedContext = normaliseContext({
      isAsynchronous: false,
    });
    let normalisedResponse: Response;

    if (!isAbsoluteURL(normalisedRequest.url)) {
      throw new RouterError(
        `Request URL must be absolute: ${normalisedRequest.url}`,
      );
    }

    try {
      do {
        this.emitBeforeEvent(normalisedRequest, normalisedContext);
        normalisedResponse = routeSync(
          normalisedRequest,
          normalisedContext,
          this.middleware,
        );
        this.emitAfterEvent(
          normalisedRequest,
          normalisedResponse,
          normalisedContext,
        );
        // TODO: create redirect request
      } while (options.redirect && isRedirect(normalisedResponse));
      return {
        ...normalisedResponse,
        url: normalisedRequest.url,
        redirected: false,
      };
    } catch (error) {
      this.emitErrorEvent(normalisedRequest, error, normalisedContext);
      throw error;
    }
  }

  public async routeAsync(
    request: Partial<Request>,
    options: RouteOptions = {redirect: 'follow'},
  ): Promise<RouteResult> {
    const normalisedRequest = normaliseRequest(request);
    const normalisedContext = normaliseContext({
      isAsynchronous: true,
    });
    let normalisedResponse: Response;

    if (!isAbsoluteURL(normalisedRequest.url)) {
      throw new RouterError(
        `Request URL must be absolute: ${normalisedRequest.url}`,
      );
    }

    try {
      do {
        this.emitBeforeEvent(normalisedRequest, normalisedContext);
        normalisedResponse = await routeAsync(
          normalisedRequest,
          normalisedContext,
          this.middleware,
        );
        this.emitAfterEvent(
          normalisedRequest,
          normalisedResponse,
          normalisedContext,
        );
        // TODO: create redirect request
      } while (options.redirect && isRedirect(normalisedResponse));
      return {
        ...normalisedResponse,
        url: normalisedRequest.url,
        redirected: false,
      };
    } catch (error) {
      this.emitErrorEvent(normalisedRequest, error, normalisedContext);
      throw error;
    }
  }
}
