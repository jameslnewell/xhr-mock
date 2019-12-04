import {URL} from 'whatwg-url';
import pathToRegExp, {Key as PathToRegExpKey} from 'path-to-regexp';
import {URLPathPattern, Request, RequestParameters} from '../../types';

export interface MatchURLPathResult {
  path: string;
  params: RequestParameters;
}

export function matchURLPath(
  pattern: URLPathPattern,
  request: Request,
): MatchURLPathResult | undefined {
  // get the request path
  const requestPath = new URL(request.url).pathname;

  // create a regexp from the path
  const keys: PathToRegExpKey[] = [];
  const regexp = pathToRegExp(pattern, keys);

  // compare the request path to the regexp path pattern and get the matching segments
  // TODO: cache the regexp
  const match = regexp.exec(requestPath);
  if (!match) {
    return undefined;
  }

  // extract params from the match
  const params = keys.reduce(
    (accum: RequestParameters, key: PathToRegExpKey, index: number) => {
      let value = match[index + 1];
      if (value) {
        value = decodeURIComponent(value);
        if (key.repeat) {
          accum[key.name] = value;
        } else {
          accum[key.name] = value;
        }
      }
      return accum;
    },
    {},
  );

  return {
    path: match.input,
    params,
  };
}
