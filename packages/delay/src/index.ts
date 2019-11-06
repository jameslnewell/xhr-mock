import {Response, Middleware} from '@xhr-mock/router';

export default function delay(
  responseOrMiddleware: Partial<Response> | Middleware,
  ms = 1500,
): Middleware {
  return (request, context) => {
    const result =
      typeof responseOrMiddleware === 'function'
        ? responseOrMiddleware(request, context)
        : responseOrMiddleware;
    if (result === undefined) {
      return undefined;
    }
    return Promise.resolve(result).then(response => {
      if (!response) {
        return undefined;
      } else {
        return new Promise<Partial<Response> | undefined>(resolve =>
          setTimeout(() => resolve(response), ms),
        );
      }
    });
  };
}
