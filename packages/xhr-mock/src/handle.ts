import {MockFunction} from './types';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';
import {MockError} from './MockError';

const NO_RESPONSE_ERROR = new MockError(
  'No handler returned a response for the request.'
);

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
        throw new MockError(
          'A handler returned a Promise<MockResponse> for a synchronous request.'
        );
      }
      return result;
    }
  }
  throw NO_RESPONSE_ERROR;
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
        throw NO_RESPONSE_ERROR;
      }
      return result;
    });
}
