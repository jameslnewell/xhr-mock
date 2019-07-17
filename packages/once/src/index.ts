import {Response, Middleware} from '@xhr-mock/router';

export default function once(
  responseOrMiddleware: Partial<Response> | Middleware,
): Middleware {
  let callCount = 0;
  return (request, context) => {
    if (callCount === 0) {
      ++callCount;
      return typeof responseOrMiddleware === 'function'
        ? responseOrMiddleware(request, context)
        : responseOrMiddleware;
    } else {
      return undefined;
    }
  };
}
