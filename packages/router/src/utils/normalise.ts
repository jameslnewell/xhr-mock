import * as statuses from 'statuses';
import {Headers, Request, Response, Context, ExecutionContext} from '../types';

function normaliseMethod(method: string): string {
  return method.toUpperCase();
}

function normaliseHeaders(headers: Headers): Headers {
  return Object.keys(headers).reduce((newHeaders: Headers, name: string) => {
    newHeaders[name.toLowerCase()] = headers[name];
    return newHeaders;
  }, {});
}

function getReasonById(status: number): string {
  return statuses.default[status] || '';
}

export function normaliseRequest(req: Partial<Request>): Request {
  return {
    version: '1.1',
    url: '/',
    params: {},
    body: undefined,
    ...req,
    method: normaliseMethod(req.method || 'GET'),
    headers: normaliseHeaders(req.headers || {}),
  };
}

export function normaliseResponse(res: Partial<Response>): Response {
  return {
    version: '1.1',
    status: 200,
    reason: getReasonById(res.status || 200),
    body: undefined,
    ...res,
    headers: normaliseHeaders(res.headers || {}),
  };
}

export function normaliseContext(ctx: Partial<Context>): Context {
  return {
    execution: ExecutionContext.Asynchronous,
    ...ctx,
  };
}
