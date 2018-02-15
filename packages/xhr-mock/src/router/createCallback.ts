import * as pathToRegExp from 'path-to-regexp';
import {RequestPathParams, Request, Response, Path, Callback} from './types';

export default function createCallback(
  method: string,
  path: Path,
  callbackOrResponse: Callback | Partial<Response>
): Callback {
  return (req: Request) => {
    // match the methods
    if (method !== '*' && method.toLowerCase() !== req.method.toLowerCase()) {
      return undefined;
    }

    // match the paths
    // TODO: check host name and port from host header
    let keys: pathToRegExp.Key[] = [];
    const regexp = pathToRegExp(path, keys);
    const match = regexp.exec(req.path);
    if (match) {
      // TODO: handle array parameters
      req.params = keys.reduce(
        (params: RequestPathParams, key: pathToRegExp.Key, i: number) => {
          params[key.name] = match[i + 1];
          return params;
        },
        {}
      );
    } else {
      return undefined;
    }

    if (typeof callbackOrResponse === 'function') {
      return callbackOrResponse(req);
    } else {
      return callbackOrResponse;
    }
  };
}
