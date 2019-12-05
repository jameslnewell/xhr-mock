import {Response, Middleware} from '@xhr-mock/router';
import sequence from '@xhr-mock/sequence';

export default function once(
  responseOrMiddleware: Partial<Response> | Middleware,
): Middleware {
  return sequence([responseOrMiddleware]);
}
