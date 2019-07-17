import {parse} from 'url';
import * as pathToRegExp from 'path-to-regexp';
import {
  MockRequestParams,
  MockRequest,
  MockResponse,
  MockURLCriteria,
  MockHandler,
  MockContext,
  MockContextWithSync,
} from './types';

function getURIParams(
  path: string,
  pattern: string | RegExp,
): MockRequestParams | undefined {
  const keys: pathToRegExp.Key[] = [];
  const regexp = pathToRegExp(pattern, keys);
  const match = regexp.exec(path);
  if (match) {
    return keys.reduce(
      (params: MockRequestParams, key: pathToRegExp.Key, i: number) => {
        let value = match[i + 1];
        if (value) {
          value = decodeURIComponent(value);
          if (key.repeat) {
            params[key.name] = value;
          } else {
            params[key.name] = value;
          }
        }
        return params;
      },
      {},
    );
  } else {
    return undefined;
  }
}

export function createHandler(
  method: string,
  uri: MockURLCriteria,
  handlerOrResponse: MockHandler | Partial<MockResponse>,
): MockHandler {
  return (req: MockRequest, ctx: MockContextWithSync) => {
    let uriParams: MockRequestParams | undefined;

    // match the method
    if (method !== '*' && method.toLowerCase() !== req.method.toLowerCase()) {
      return undefined;
    }

    // parse the uri
    if (uri instanceof RegExp) {
      // TODO: regexp should be compared to the full URL
      uri.lastIndex = 0; // reset the state of the regexp since it will be reused for the next request
      if (!uri.test(req.uri)) {
        return undefined;
      }
    } else {
      const parsedMatchURI = parse(uri);
      const parsedRequestURI = parse(uri);

      // TODO: match the host
      // if (req.headers.host && req.headers.host !== parsedURI.host) {
      //   return undefined;
      // }

      // match the URI path
      uriParams = getURIParams(
        parsedRequestURI.pathname,
        parsedMatchURI.pathname,
      );
      if (!uriParams) {
        return undefined;
      }
    }

    if (typeof handlerOrResponse === 'function') {
      // create a new request with the params matched from the path
      const reqWithPathParams = {
        ...req,
        params: {
          ...uriParams,
        },
      };

      return handlerOrResponse(reqWithPathParams, ctx);
    } else {
      return handlerOrResponse;
    }
  };
}
