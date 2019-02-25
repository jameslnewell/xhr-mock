import * as URL from 'url-parse';
import * as pathToRegExp from 'path-to-regexp';
import {Parameters, Request, Response, MethodPattern, PathPattern, Middleware, Context} from './types';

function methodMatches(pattern: MethodPattern, request: Request): string | undefined {
  if (pattern === '*') {
    return request.method;
  }

  if (pattern.toLowerCase() === request.method.toLowerCase()) {
    return request.method;
  }

  return undefined;
}

function uriMatches(pattern: PathPattern, request: Request): {uri: string; params: Parameters} | undefined {
  // get the actual URI and default any missing values
  const actualURI = new URL(request.uri, {hostname: request.headers.host});

  // get the expected URI
  const expectedURI = !(pattern instanceof RegExp) ? new URL(pattern, {}) : undefined;

  // match the protocol, host and port
  if (expectedURI) {
    // TODO: protocol
    if (expectedURI.hostname && expectedURI.host !== actualURI.host) {
      return undefined;
    }
  }

  // match the path
  const keys: pathToRegExp.Key[] = [];
  const regexp = pathToRegExp(expectedURI ? expectedURI.pathname : pattern, keys); // TODO: cache the regexp
  const match = regexp.exec(actualURI.pathname);
  if (!match) {
    return undefined;
  }

  const params = keys.reduce((accum: Parameters, key: pathToRegExp.Key, index: number) => {
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
  }, {});

  return {
    uri: request.uri,
    params
  };
}

export function createMiddleware(
  method: string,
  path: PathPattern,
  middlewareOrResponse: Middleware | Partial<Response>
): Middleware {
  return (request: Request, context: Context) => {
    // match the method
    const methodMatch = methodMatches(method, request);
    if (!methodMatch) {
      return undefined;
    }

    const uriMatch = uriMatches(path, request);
    if (!uriMatch) {
      return undefined;
    }

    // if the user has provided a middleware function, return the middleware's response
    if (typeof middlewareOrResponse === 'function') {
      // add the params matched from the path to the request
      const reqWithPathParams = {
        ...request,
        params: uriMatch.params
      };
      return middlewareOrResponse(reqWithPathParams, context);
    }

    // if the user has provided a response, return their response
    return middlewareOrResponse;
  };
}
