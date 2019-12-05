import {Request, Response, Context, Middleware, RouterError} from '../types';
import {isPromise} from './isPromise';
import {normaliseResponse} from './normalise';

export function routeSync(
  request: Request,
  context: Context,
  middleware: Middleware[],
): Response {
  for (const ware of middleware) {
    const response = ware(request, context);
    if (!response) {
      continue;
    }
    if (isPromise(response)) {
      throw new RouterError(
        'A middleware returned a response asynchronously while the request was being handled synchronously.',
      );
    }
    return normaliseResponse(response);
  }
  throw new RouterError('No middleware returned a response for the request.');
}
