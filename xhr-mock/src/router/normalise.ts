import * as statuses from 'statuses';
import {MockHeaders, MockRequest, MockResponse} from './types';

function normaliseMethod(method: string): string {
  return method.toUpperCase();
}

function normaliseHeaders(headers: MockHeaders): MockHeaders {
  return Object.keys(headers).reduce((newHeaders: MockHeaders, name: string) => {
    newHeaders[name.toLowerCase()] = headers[name];
    return newHeaders;
  }, {});
}

function getReasonById(status: number): string {
  return statuses[status] || '';
}

export function normaliseRequest(req: Partial<MockRequest>): MockRequest {
  return {
    version: '1.1',
    uri: '/',
    body: undefined,
    ...req,
    method: normaliseMethod(req.method || 'GET'),
    headers: normaliseHeaders(req.headers || {})
  };
}

export function normaliseResponse(res: Partial<MockResponse>): MockResponse {
  return {
    version: '1.1',
    status: 200,
    reason: getReasonById(res.status || 200),
    body: undefined,
    ...res,
    headers: normaliseHeaders(res.headers || {})
  };
}
