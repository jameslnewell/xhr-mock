import {Request, Response, Context, Middleware, Error} from '../types';
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
      throw new Error(
        'A middleware returned a response asynchronously while the request was being handled synchronously.',
      );
    }
    return normaliseResponse(response);
  }
  throw new Error('No middleware returned a response for the request.');
}
