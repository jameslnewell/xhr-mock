import {URL} from 'whatwg-url';
import {URLObjectPattern, Request, RequestParameters} from '../../types';
import {getDefaultPort} from '../getDefaultPort';
import {matchURLPath} from './matchURLPath';
import {matchURLQuery} from './matchURLQuery';

export interface MatchURLResult {
  protocol?: string;
  host?: string;
  port?: number;
  path?: string;
  params?: RequestParameters;
  query?: {[name: string]: string};
}

export function matchURL(
  pattern: URLObjectPattern,
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

  const port = getDefaultPort(requestURL);
  if (pattern.port && pattern.port !== port) {
    return undefined;
  }

  let urlPathMatch =
    (pattern.path && matchURLPath(pattern.path, request)) || undefined;
  if (pattern.path && !urlPathMatch) {
    return undefined;
  }

  let urlQueryMatch =
    (pattern.query && matchURLQuery(pattern.query, request)) || undefined;
  if (pattern.query && !urlQueryMatch) {
    return undefined;
  }

  return {
    protocol: requestURL.protocol,
    host: requestURL.hostname,
    port: port,
    path: urlPathMatch && urlPathMatch.path,
    params: urlPathMatch && urlPathMatch.params,
    query: urlQueryMatch,
  };
}
