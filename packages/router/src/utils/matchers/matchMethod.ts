import {MethodPattern, Request} from '../../types';

export function matchMethod(
  pattern: MethodPattern,
  request: Request,
): string | undefined {
  if (pattern === '*') {
    return request.method;
  }

  if (pattern.toLowerCase() === request.method.toLowerCase()) {
    return request.method;
  }

  return undefined;
}
