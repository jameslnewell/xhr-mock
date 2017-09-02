import {MockFunction} from './types';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';

function isPromise(arg: any): arg is Promise<MockResponse | undefined> {
  return arg && (arg as Promise<MockResponse | undefined>).then !== undefined;
}

export function sync(
  handlers: MockFunction[],
  request: MockRequest,
  response: MockResponse
): MockResponse {
  for (let i = 0; i < handlers.length; ++i) {
    const result = handlers[i](request, response);

    if (result) {
      if (isPromise(result)) {
        throw new Error(
          'xhr-mock: A MockFunction returned a Promise<MockResponse> in sync mode.'
        );
      }
      return result;
    }
  }
  throw new Error('xhr-mock: No MockFunction returned a MockResponse.');
}

export function async(
  handlers: MockFunction[],
  request: MockRequest,
  response: MockResponse
): Promise<MockResponse> {
  return handlers
    .reduce(
      (promise, handler) =>
        promise.then(result => {
          if (!result) {
            return handler(request, response);
          }
          return result;
        }),
      Promise.resolve(undefined)
    )
    .then(result => {
      if (!result) {
        throw new Error('xhr-mock: No MockFunction returned a MockResponse.');
      }
      return result;
    });
}
