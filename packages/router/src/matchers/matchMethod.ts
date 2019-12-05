import {MethodPattern, Request} from '../types';

export function matchMethod(pattern: MethodPattern, request: Request): boolean {
  return (
    pattern === '*' || pattern.toLowerCase() === request.method.toLowerCase()
  );
}
