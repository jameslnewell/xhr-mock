import {URL} from 'whatwg-url';
import pathToRegExp, {Key as PathToRegExpKey} from 'path-to-regexp';
import {
  Request,
  Response,
  MethodPattern,
  URLPathPattern,
  Middleware,
  Context,
  RequestWithParameters,
} from '../types';
import {matchMethod} from './matchers/matchMethod';

interface Parameters {
  [name: string]: string;
}

function urlMatches(
  pattern: URLPathPattern,
  request: Request,
): {url: string; params: Parameters} | undefined {
  // get the actual URL and default any missing values
  // FIXME: fill in hostname from request headers => request.headers.host
  const actualURL = new URL(request.url);

  // get the expected URL
  const expectedURL = !(pattern instanceof RegExp)
    ? new URL(pattern)
    : undefined;

  // match the protocol, host, port and querystring
  if (expectedURL) {
    // TODO: protocol
    if (
      expectedURL.hostname &&
      (expectedURL.host !== actualURL.host ||
        expectedURL.port !== actualURL.port)
    ) {
      return undefined;
    }

    // check querystring params are equal
    // console.log(expectedURL.)
  }

  // match the path
  const keys: PathToRegExpKey[] = [];
  const regexp = pathToRegExp(
    expectedURL ? expectedURL.pathname : pattern,
    keys,
  ); // TODO: cache the regexp
  const match = regexp.exec(actualURL.pathname);
  if (!match) {
    return undefined;
  }

  const params = keys.reduce(
    (accum: Parameters, key: PathToRegExpKey, index: number) => {
      let value = match[index + 1];
      if (value) {
        value = decodeURIComponent(value);
        if (key.repeat) {
          accum[key.name] = value;
        } else {
          accum[key.name] = value;
        }
      }
      return accum;
    },
    {},
  );

  return {
    url: request.url,
    params,
  };
}

// TODO: for "path" (url) support matching all the properties of an object like {protocol: string, host: string, port: number, path (string | regexp | path-to-regexp), query: object}
export function createMiddleware(
  method: string,
  path: URLPathPattern,
  middlewareOrResponse: Middleware<RequestWithParameters> | Partial<Response>,
): Middleware {
  return (request: Request, context: Context) => {
    // match the method
    const methodMatch = matchMethod(method, request);
    if (!methodMatch) {
      return undefined;
    }

    // match the url
    const urlMatch = urlMatches(path, request);
    if (!urlMatch) {
      return undefined;
    }

    // if the user has provided a middleware function, return the middleware's response
    if (typeof middlewareOrResponse === 'function') {
      // add the params matched from the path to the request
      const reqWithPathParams = {
        ...request,
        params: urlMatch.params,
      };
      return middlewareOrResponse(reqWithPathParams, context);
    }

    // if the user has provided a response, return their response
    return middlewareOrResponse;
  };
}
