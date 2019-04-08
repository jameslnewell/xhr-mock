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

function urlMatches(pattern: PathPattern, request: Request): {url: string; params: Parameters} | undefined {
  // get the actual URL and default any missing values
  const actualURL = new URL(request.url, {hostname: request.headers.host});

  // get the expected URL
  const expectedURL = !(pattern instanceof RegExp) ? new URL(pattern, {}) : undefined;

  // match the protocol, host and port
  if (expectedURL) {
    // TODO: protocol
    if (expectedURL.hostname && expectedURL.host !== actualURL.host) {
      return undefined;
    }
  }

  // match the path
  const keys: pathToRegExp.Key[] = [];
  const regexp = pathToRegExp(expectedURL ? expectedURL.pathname : pattern, keys); // TODO: cache the regexp
  const match = regexp.exec(actualURL.pathname);
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
    url: request.url,
    params
  };
}

export function createMiddleware<C>(
  method: string,
  path: PathPattern,
  middlewareOrResponse: Middleware<C> | Partial<Response>
): Middleware<C> {
  return (request: Request, context: Context<C>) => {
    // match the method
    const methodMatch = methodMatches(method, request);
    if (!methodMatch) {
      return undefined;
    }

    const urlMatch = urlMatches(path, request);
    if (!urlMatch) {
      return undefined;
    }

    // if the user has provided a middleware function, return the middleware's response
    if (typeof middlewareOrResponse === 'function') {
      // add the params matched from the path to the request
      const reqWithPathParams = {
        ...request,
        params: urlMatch.params
      };
      return middlewareOrResponse(reqWithPathParams, context);
    }

    // if the user has provided a response, return their response
    return middlewareOrResponse;
  };
}
