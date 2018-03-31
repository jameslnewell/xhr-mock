import {
  MockRequest,
  MockResponse,
  MockContext,
  MockMethodCriteria,
  MockURICriteria,
  MockHandler,
  MockBeforeCallback,
  MockAfterCallback,
  MockErrorCallback,
  MockErrorCallbackEvent,
  MockAfterCallbackEvent
} from './types';
import {MockError} from '../MockError';
import {createHandler} from './createHandler';
import {isPromise} from './isPromise';
import {formatMessage} from './formatMessage';
import {normaliseRequest, normaliseResponse} from './normalise';

function afterLogger(event: MockAfterCallbackEvent) {
  const {req, res} = event;
  console.info(
    formatMessage('A handler returned a response for the request.', {req, res})
  );
}

function errorLogger(event: MockErrorCallbackEvent) {
  const {req, err} = event;
  if (err instanceof MockError) {
    console.error(formatMessage(err.message, {req}));
  } else {
    console.error(
      formatMessage('A handler returned an error for the request.', {req, err})
    );
  }
}

export class MockRouter {
  private beforeHandlerCallback?: MockBeforeCallback;
  private afterHandlerCallback?: MockAfterCallback = afterLogger;
  private handlerErrorCallback?: MockErrorCallback = errorLogger;
  private handlers: MockHandler[] = [];

  clear() {
    this.handlers = [];
    this.beforeHandlerCallback = undefined;
    this.afterHandlerCallback = afterLogger;
    this.handlerErrorCallback = errorLogger;
    return this;
  }

  before(callback: MockBeforeCallback) {
    this.beforeHandlerCallback = callback;
    return this;
  }

  after(callback: MockAfterCallback) {
    this.afterHandlerCallback = callback;
    return this;
  }

  error(callback: MockErrorCallback) {
    this.handlerErrorCallback = callback;
    return this;
  }

  use(handler: MockHandler): MockRouter;
  use(
    method: MockMethodCriteria,
    uri: MockURICriteria,
    handler: MockHandler
  ): MockRouter;
  use(
    method: MockMethodCriteria,
    uri: MockURICriteria,
    response: Partial<MockResponse>
  ): MockRouter;
  use(
    methodOrHandler: MockMethodCriteria | MockHandler,
    uri?: MockURICriteria,
    handlerOrResponse?: MockHandler | Partial<MockResponse>
  ): MockRouter {
    if (typeof methodOrHandler === 'function' && !uri && !handlerOrResponse) {
      this.handlers.push(methodOrHandler);
    } else if (
      typeof methodOrHandler === 'string' &&
      uri &&
      handlerOrResponse
    ) {
      this.handlers.push(
        createHandler(methodOrHandler, uri, handlerOrResponse)
      );
    } else {
      throw new MockError('Invalid parameters.');
    }
    return this;
  }

  get(uri: MockURICriteria, handler: MockHandler): MockRouter;
  get(uri: MockURICriteria, response: Partial<MockResponse>): MockRouter;
  get(
    uri: MockURICriteria,
    handlerOrResponse: MockHandler | Partial<MockResponse>
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

  post(uri: MockURICriteria, handler: MockHandler): MockRouter;
  post(uri: MockURICriteria, response: Partial<MockResponse>): MockRouter;
  post(
    uri: MockURICriteria,
    handlerOrResponse: MockHandler | Partial<MockResponse>
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

  put(uri: MockURICriteria, handler: MockHandler): MockRouter;
  put(uri: MockURICriteria, response: Partial<MockResponse>): MockRouter;
  put(
    uri: MockURICriteria,
    handlerOrResponse: MockHandler | Partial<MockResponse>
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

  patch(uri: MockURICriteria, handler: MockHandler): MockRouter;
  patch(uri: MockURICriteria, response: Partial<MockResponse>): MockRouter;
  patch(
    uri: MockURICriteria,
    handlerOrResponse: MockHandler | Partial<MockResponse>
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

  delete(uri: MockURICriteria, handler: MockHandler): MockRouter;
  delete(uri: MockURICriteria, response: Partial<MockResponse>): MockRouter;
  delete(
    uri: MockURICriteria,
    handlerOrResponse: MockHandler | Partial<MockResponse>
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

  routeSync(req: Partial<MockRequest>, ctx: MockContext): MockResponse {
    const fullRequest = normaliseRequest(req);
    const fullContext = {...ctx, sync: true};
    if (this.beforeHandlerCallback) {
      this.beforeHandlerCallback({req: fullRequest, ctx: fullContext});
    }
    try {
      for (let i = 0; i < this.handlers.length; ++i) {
        const res = this.handlers[i](fullRequest, fullContext);
        if (!res) {
          continue;
        }
        if (isPromise(res)) {
          throw new MockError(
            'A handler returned a response asynchronously while the request is being routed synchronously.'
          );
        }
        const fullResponse = normaliseResponse(res);
        if (this.afterHandlerCallback) {
          this.afterHandlerCallback({
            req: fullRequest,
            res: fullResponse,
            ctx: fullContext
          });
        }
        return fullResponse;
      }
      throw new MockError('No handler returned a response for the request.');
    } catch (err) {
      if (this.handlerErrorCallback) {
        this.handlerErrorCallback({
          req: fullRequest,
          err: err,
          ctx: fullContext
        });
      }
      throw err;
    }
  }

  async routeAsync(
    req: Partial<MockRequest>,
    ctx: MockContext
  ): Promise<MockResponse> {
    const fullRequest = normaliseRequest(req);
    const fullContext = {...ctx, sync: false};
    if (this.beforeHandlerCallback) {
      this.beforeHandlerCallback({req: fullRequest, ctx: fullContext});
    }

    try {
      const res = await this.handlers.reduce(
        (promise, handler) =>
          promise.then(res => {
            if (res) {
              return res;
            } else {
              return handler(fullRequest, fullContext);
            }
          }),
        Promise.resolve(undefined)
      );

      if (res) {
        const fullResponse = normaliseResponse(res);
        if (this.afterHandlerCallback) {
          this.afterHandlerCallback({
            req: fullRequest,
            res: fullResponse,
            ctx: fullContext
          });
        }
        return fullResponse;
      } else {
        throw new MockError('No handler returned a response for the request.');
      }
    } catch (err) {
      if (this.handlerErrorCallback) {
        this.handlerErrorCallback({req: fullRequest, err, ctx: fullContext});
      }
      throw err;
    }
  }
}
