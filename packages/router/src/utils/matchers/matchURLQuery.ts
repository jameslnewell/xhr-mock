import {Request} from '../../types';

export function matchURLQuery(
  pattern: {[name: string]: string},
  request: Request,
): {} | undefined {
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