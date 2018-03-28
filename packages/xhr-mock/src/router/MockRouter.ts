import {
  Request,
  Response,
  MethodMatch,
  URIMatch,
  RouteHandler,
  BeforeRouteCallback,
  AfterRouteCallback,
  ErrorRouteCallback,
  ErrorRouteEvent,
  AfterRouteEvent
} from '../types';
import MockError from '../MockError';
import createRouteHandler from './createRouteHandler';
import isPromise from './isPromise';
import {normaliseRequest, normaliseResponse} from './normalise';

function afterLogger(event: AfterRouteEvent) {
  const {req, res} = event;
  console.info(`
  xhr-mock: A request resolved to a response:

     REQUEST: ${req.method} ${req.uri} HTTP/${req.version}

    RESPONSE: HTTP/${res.version} ${res.status} ${res.reason}

`);
}

function errorLogger(event: ErrorRouteEvent) {
  const {req, err} = event;
  console.error(`
    xhr-mock: An error occured whilst routing a request:

      REQUEST: ${req.method} ${req.uri} HTTP/${req.version}

        ERROR: ${err.message}

  `);
}

export default class MockRouter {
  private beforeCallback: BeforeRouteCallback;
  private afterCallback: AfterRouteCallback = afterLogger;
  private errorCallback: ErrorRouteCallback = errorLogger;
  private routeHandlers: RouteHandler[] = [];

  clear() {
    this.routeHandlers = [];
    return this;
  }

  before(callback: BeforeRouteCallback) {
    this.beforeCallback = callback;
    return this;
  }

  after(callback: AfterRouteCallback) {
    this.afterCallback = callback;
    return this;
  }

  error(callback: ErrorRouteCallback) {
    this.errorCallback = callback;
    return this;
  }

  use(handler: RouteHandler): MockRouter;
  use(method: MethodMatch, uri: URIMatch, handler: RouteHandler): MockRouter;
  use(
    method: MethodMatch,
    uri: URIMatch,
    response: Partial<Response>
  ): MockRouter;
  use(
    methodOrHandler: MethodMatch | RouteHandler,
    uri?: URIMatch,
    handlerOrResponse?: RouteHandler | Partial<Response>
  ): MockRouter {
    if (typeof methodOrHandler === 'function' && !uri && !handlerOrResponse) {
      this.routeHandlers.push(methodOrHandler);
    } else if (
      typeof methodOrHandler === 'string' &&
      uri &&
      handlerOrResponse
    ) {
      this.routeHandlers.push(
        createRouteHandler(methodOrHandler, uri, handlerOrResponse)
      );
    } else {
      throw new Error('Invalid parameters.');
    }
    return this;
  }

  get(uri: URIMatch, handler: RouteHandler): MockRouter;
  get(uri: URIMatch, response: Partial<Response>): MockRouter;
  get(
    uri: URIMatch,
    handlerOrResponse: RouteHandler | Partial<Response>
  ): MockRouter {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof handlerOrResponse === 'function') {
      this.use('get', uri, handlerOrResponse);
    } else {
      this.use('get', uri, handlerOrResponse);
    }
    return this;
  }

  post(uri: URIMatch, handler: RouteHandler): MockRouter;
  post(uri: URIMatch, response: Partial<Response>): MockRouter;
  post(
    uri: URIMatch,
    handlerOrResponse: RouteHandler | Partial<Response>
  ): MockRouter {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof handlerOrResponse === 'function') {
      this.use('post', uri, handlerOrResponse);
    } else {
      this.use('post', uri, handlerOrResponse);
    }
    return this;
  }

  put(uri: URIMatch, handler: RouteHandler): MockRouter;
  put(uri: URIMatch, response: Partial<Response>): MockRouter;
  put(
    uri: URIMatch,
    handlerOrResponse: RouteHandler | Partial<Response>
  ): MockRouter {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof handlerOrResponse === 'function') {
      this.use('put', uri, handlerOrResponse);
    } else {
      this.use('put', uri, handlerOrResponse);
    }
    return this;
  }

  patch(uri: URIMatch, handler: RouteHandler): MockRouter;
  patch(uri: URIMatch, response: Partial<Response>): MockRouter;
  patch(
    uri: URIMatch,
    handlerOrResponse: RouteHandler | Partial<Response>
  ): MockRouter {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof handlerOrResponse === 'function') {
      this.use('patch', uri, handlerOrResponse);
    } else {
      this.use('patch', uri, handlerOrResponse);
    }
    return this;
  }

  delete(uri: URIMatch, handler: RouteHandler): MockRouter;
  delete(uri: URIMatch, response: Partial<Response>): MockRouter;
  delete(
    uri: URIMatch,
    handlerOrResponse: RouteHandler | Partial<Response>
  ): MockRouter {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof handlerOrResponse === 'function') {
      this.use('delete', uri, handlerOrResponse);
    } else {
      this.use('delete', uri, handlerOrResponse);
    }
    return this;
  }

  // TODO: CONTEXT
  routeSync(req: Partial<Request>): Response {
    const fullRequest = normaliseRequest(req);
    if (this.beforeCallback) {
      this.beforeCallback({req: fullRequest});
    }
    try {
      for (let i = 0; i < this.routeHandlers.length; ++i) {
        const res = this.routeHandlers[i](fullRequest);
        if (!res) {
          continue;
        }
        if (isPromise(res)) {
          throw new MockError(
            'A handler returned a response asynchronously while the request is being routed synchronously.'
          );
        }
        const fullResponse = normaliseResponse(res);
        if (this.afterCallback) {
          this.afterCallback({req: fullRequest, res: fullResponse});
        }
        return fullResponse;
      }
      throw new MockError('No response was returned by a handler.');
    } catch (error) {
      if (this.errorCallback) {
        this.errorCallback({req: fullRequest, err: error});
      }
      throw error;
    }
  }

  // TODO: CONTEXT
  routeAsync(req: Partial<Request>): Promise<Response> {
    const fullRequest = normaliseRequest(req);
    if (this.beforeCallback) {
      this.beforeCallback({req: fullRequest});
    }
    return this.routeHandlers
      .reduce(
        (promise, handler) =>
          promise.then(res => {
            if (res) {
              return res;
            } else {
              return handler(fullRequest);
            }
          }),
        Promise.resolve(undefined)
      )
      .then(res => {
        if (res) {
          const fullResponse = normaliseResponse(res);
          if (this.afterCallback) {
            this.afterCallback({req: fullRequest, res: fullResponse});
          }
          return fullResponse;
        } else {
          throw new MockError('No response was returned by a handler.');
        }
      })
      .catch(error => {
        if (this.errorCallback) {
          this.errorCallback({req: fullRequest, err: error});
        }
        throw error;
      });
  }
}
