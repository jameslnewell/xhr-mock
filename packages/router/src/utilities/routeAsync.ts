import {Request, Response, Context, Middleware, RouterError} from '../types';
import {normaliseResponse} from './normalise';

export async function routeAsync(
  request: Request,
  context: Context,
  middleware: Middleware[],
): Promise<Response> {
  for (const ware of middleware) {
    const response = await ware(request, context);
    if (!response) {
      continue;
    }
    return normaliseResponse(response);
  }
  throw new RouterError('No middleware returned a response for the request.');
}
