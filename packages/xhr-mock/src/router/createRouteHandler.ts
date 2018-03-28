import {parse} from 'url';
import * as pathToRegExp from 'path-to-regexp';
import {
  RequestParams,
  Request,
  Response,
  URIMatch,
  RouteHandler,
  Context
} from '../types';

function getURIParams(
  path: string,
  pattern: string | RegExp
): RequestParams | undefined {
  let keys: pathToRegExp.Key[] = [];
  const regexp = pathToRegExp(pattern, keys);
  const match = regexp.exec(path);
  if (match) {
    return keys.reduce(
      (params: RequestParams, key: pathToRegExp.Key, i: number) => {
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
      {}
    );
  } else {
    return undefined;
  }
}

export default function createRouteHandler(
  method: string,
  uri: URIMatch,
  handlerOrResponse: RouteHandler | Partial<Response>
): RouteHandler {
  return (req: Request, ctx: Context) => {
    let uriParams: RequestParams | undefined;

    // match the method
    if (method !== '*' && method.toLowerCase() !== req.method.toLowerCase()) {
      return undefined;
    }

    // parse the uri
    // TODO: check for regexp
    if (typeof uri === 'string') {
      const parsedURI = parse(uri);

      // match the host
      // if (req.headers.host && req.headers.host !== parsedURI.host) {
      //   return undefined;
      // }

      // match the URI
      uriParams = getURIParams(req.uri, parsedURI.pathname);
      if (!uriParams) {
        return undefined;
      }
    } else {
      // regex should be compared to the full URL
      uri.lastIndex = 0; // reset state of regexp since its reused
      if (!uri.test(req.uri)) {
        return undefined;
      }
    }

    if (typeof handlerOrResponse === 'function') {
      // create a new request with the params matched from the path
      const reqWithPathParams = {
        ...req,
        params: {
          ...uriParams
        }
      };

      return handlerOrResponse(reqWithPathParams, ctx);
    } else {
      return handlerOrResponse;
    }
  };
}
