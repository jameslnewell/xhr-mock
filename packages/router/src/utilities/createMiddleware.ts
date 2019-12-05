import {URL} from 'whatwg-url';
import isAbsoluateURL from 'is-absolute-url';
import {
  Request,
  Response,
  URLPattern,
  Middleware,
  Context,
  RequestWithParameters,
} from '../types';
import {getDefaultPort} from './getDefaultPort';
import {matchMethod} from '../matchers/matchMethod';
import {matchURL} from '../matchers/matchURL';
import {matchURLPath} from '../matchers/matchURLPath';

// TODO: for "path" (url) support matching all the properties of an object like {protocol: string, host: string, port: number, path (string | regexp | path-to-regexp), query: object}
export function createMiddleware(
  method: string,
  url: URLPattern,
  middlewareOrResponse: Middleware<RequestWithParameters> | Partial<Response>,
): Middleware {
  return (request: Request, context: Context) => {
    // match the method
    const methodMatch = matchMethod(method, request);
    if (!methodMatch) {
      return undefined;
    }

    // match the url
    let urlMatch;
    if (typeof url === 'string' && isAbsoluateURL(url)) {
      const parts = new URL(url);
      urlMatch = matchURL(
        {
          protocol: parts.protocol,
          host: parts.hostname,
          port: getDefaultPort(parts),
          path: parts.pathname,
          query: Array.from(parts.searchParams[Symbol.iterator]()).reduce(
            (obj, [key, val]) => ({
              ...obj,
              [key]: val,
            }),
            {},
          ),
        },
        request,
      );
    } else if (typeof url === 'string' || url instanceof RegExp) {
      urlMatch = matchURLPath(url, request);
    } else {
      urlMatch = matchURL(url, request);
    }
    if (!urlMatch) {
      return undefined;
    }

    // if the user has provided a middleware function, return the middleware's response
    if (typeof middlewareOrResponse === 'function') {
      // add the params matched from the path to the request
      const reqWithPathParams = {
        ...request,
        params: urlMatch.params || {},
      };
      return middlewareOrResponse(reqWithPathParams, context);
    }

    // if the user has provided a response, return their response
    return middlewareOrResponse;
  };
}
