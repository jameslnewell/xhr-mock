import {Request} from '../types';

export function matchURLQuery(
  pattern: Record<string, string>,
  request: Request,
): Record<string, string> | undefined {
  // get the request query
  const requestQuery = new URL(request.url).searchParams;

  // check the request query object contains the pattern properties and values - extra properties are OK
  for (const name in pattern) {
    if (requestQuery.get(name) !== pattern[name]) {
      return undefined;
    }
  }

  return pattern;
}
