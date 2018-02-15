import {Request, Response, Path, Callback} from './types';
import XHRMockError from './XHRMockError';
import createMatchCallback from './createCallback';
import isPromise from './isPromise';
import {normaliseRequest, normaliseResponse} from './normalise';

export default class Router {
  private callbacks: Callback[] = [];

  clear() {
    this.callbacks = [];
    return this;
  }

  use(callback: Callback): Router;
  use(method: string, path: Path, callback: Callback): Router;
  use(method: string, path: Path, response: Partial<Response>): Router;
  use(
    methodOrCallback: string | Callback,
    path?: Path,
    callbackOrResponse?: Callback | Partial<Response>
  ): Router {
    if (
      typeof methodOrCallback === 'function' &&
      !path &&
      !callbackOrResponse
    ) {
      this.callbacks.push(methodOrCallback);
    } else if (
      typeof methodOrCallback === 'string' &&
      path &&
      callbackOrResponse
    ) {
      this.callbacks.push(
        createMatchCallback(methodOrCallback, path, callbackOrResponse)
      );
    } else {
      throw new Error('Invalid parameters.');
    }
    return this;
  }

  get(path: Path, callback: Callback): Router;
  get(path: Path, response: Partial<Response>): Router;
  get(path: Path, callbackOrResponse: Callback | Partial<Response>): Router {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof callbackOrResponse === 'function') {
      this.use('get', path, callbackOrResponse);
    } else {
      this.use('get', path, callbackOrResponse);
    }
    return this;
  }

  post(path: Path, callback: Callback): Router;
  post(path: Path, response: Partial<Response>): Router;
  post(path: Path, callbackOrResponse: Callback | Partial<Response>): Router {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof callbackOrResponse === 'function') {
      this.use('post', path, callbackOrResponse);
    } else {
      this.use('post', path, callbackOrResponse);
    }
    return this;
  }

  put(path: Path, callback: Callback): Router;
  put(path: Path, response: Partial<Response>): Router;
  put(path: Path, callbackOrResponse: Callback | Partial<Response>): Router {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof callbackOrResponse === 'function') {
      this.use('put', path, callbackOrResponse);
    } else {
      this.use('put', path, callbackOrResponse);
    }
    return this;
  }

  patch(path: Path, callback: Callback): Router;
  patch(path: Path, response: Partial<Response>): Router;
  patch(path: Path, callbackOrResponse: Callback | Partial<Response>): Router {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof callbackOrResponse === 'function') {
      this.use('patch', path, callbackOrResponse);
    } else {
      this.use('patch', path, callbackOrResponse);
    }
    return this;
  }

  delete(path: Path, callback: Callback): Router;
  delete(path: Path, response: Partial<Response>): Router;
  delete(path: Path, callbackOrResponse: Callback | Partial<Response>): Router {
    // this branch is used to get around the weak type Partial<Response>
    // @see https://blog.mariusschulz.com/2017/12/01/typescript-2-4-weak-type-detection
    if (typeof callbackOrResponse === 'function') {
      this.use('delete', path, callbackOrResponse);
    } else {
      this.use('delete', path, callbackOrResponse);
    }
    return this;
  }

  routeSync(req: Partial<Request>): Response {
    const fullRequest = normaliseRequest(req);
    for (let i = 0; i < this.callbacks.length; ++i) {
      const res = this.callbacks[i](fullRequest);

      if (!res) {
        continue;
      }

      if (isPromise(res)) {
        throw new XHRMockError(
          'A callback returned a response asynchronously in a synchronous request.'
        );
      }

      return normaliseResponse(res);
    }

    throw new XHRMockError('No response was returned by a callback.');
  }

  routeAsync(req: Partial<Request>): Promise<Response> {
    const fullRequest = normaliseRequest(req);
    return this.callbacks
      .reduce(
        (promise, callback) =>
          promise.then(res => {
            if (res) {
              return res;
            } else {
              return callback(fullRequest);
            }
          }),
        Promise.resolve(undefined)
      )
      .then(res => {
        if (res) {
          return normaliseResponse(res);
        } else {
          throw new XHRMockError('No response was returned by a callback.');
        }
      });
  }
}
