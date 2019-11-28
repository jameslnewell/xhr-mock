import {URL} from 'whatwg-url';
import {URLPattern, Request, RequestParameters} from '../../types';
import {matchURLPath} from './matchURLPath';
import {matchURLQuery} from './matchURLQuery';

export interface MatchURLResult {
  path: string;
  params: RequestParameters;
}

export function matchURL(
  pattern: URLPattern,
  request: Request,
): MatchURLResult | undefined {
  // get the request path
  const requestURL = new URL(request.url);

  if (pattern.protocol && pattern.protocol !== requestURL.protocol) {
    return undefined;
  }

  if (pattern.host && pattern.host !== requestURL.hostname) {
    return undefined;
  }

  if (pattern.port && pattern.port !== parseInt(requestURL.port, 10)) {
    return undefined;
  }

  if (pattern.path && !matchURLPath(pattern.path, request)) {
    return undefined;
  }

  if (pattern.query && !matchURLQuery(pattern.query, request)) {
    return undefined;
  }

  return {};
}
