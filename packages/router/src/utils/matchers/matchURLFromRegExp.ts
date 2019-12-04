import {Request} from '../../types';

export function matchURLFromRegExp(pattern: RegExp, request: Request): boolean {
  return Boolean(pattern.test(request.url));
}
