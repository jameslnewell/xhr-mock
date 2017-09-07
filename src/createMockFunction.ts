import {Mock, MockObject, MockFunction} from './types';
import {formatURL} from './MockURL';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';

function createResponseFromObject(object: MockObject) {
  const {status, reason, headers, body} = object;
  const response = new MockResponse();

  if (status) {
    response.status(status);
  }

  if (reason) {
    response.reason(reason);
  }

  if (headers) {
    response.headers(headers);
  }

  if (body) {
    response.body(body);
  }

  return response;
}

export default function(
  method: string,
  url: string | RegExp,
  mock: Mock
): MockFunction {
  const matches = (req: MockRequest) => {
    const requestMethod = req.method();
    const requestURL = req.url().toString();

    if (requestMethod.toUpperCase() !== method.toUpperCase()) {
      return false;
    }

    if (url instanceof RegExp) {
      url.lastIndex = 0; //reset state of global regexp
      return url.test(requestURL);
    }

    return requestURL === url; //TODO: should we use .startsWith()???
  };

  return (req, res) => {
    if (matches(req)) {
      if (typeof mock === 'object') {
        return createResponseFromObject(mock);
      } else {
        return mock(req, res);
      }
    }
  };
}
