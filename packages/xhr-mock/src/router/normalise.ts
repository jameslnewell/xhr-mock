import * as statuses from 'statuses';
import {Headers, Request, Response} from './types';

function normaliseMethod(method: string): string {
  return method.toLowerCase();
}

function normaliseHeaders(headers: Headers): Headers {
  return Object.keys(headers).reduce((newHeaders: Headers, name: string) => {
    newHeaders[name.toLowerCase()] = headers[name];
    return newHeaders;
  }, {});
}

function getReasonById(status: number): string {
  return statuses[status] || '';
}

// TODO: add params and query
export function normaliseRequest(req: Partial<Request>): Request {
  return {
    version: '1.1',
    path: '/',
    query: {},
    params: {},
    body: undefined,
    ...req,
    method: normaliseMethod(req.method || 'get'),
    headers: normaliseHeaders(req.headers || {})
  };
}

export function normaliseResponse(res: Partial<Response>): Response {
  return {
    version: '1.1',
    status: 200,
    reason: getReasonById(res.status || 200),
    body: undefined,
    ...res,
    headers: normaliseHeaders(res.headers || {})
  };
}
