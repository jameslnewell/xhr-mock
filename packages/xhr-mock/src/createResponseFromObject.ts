import {MockObject} from './types';
import MockResponse from './MockResponse';

export function createResponseFromObject(object: MockObject): MockResponse {
  const {status, reason, headers, body} = object;
  const response = new MockResponse();

  if (status) {
    response.status(status);
  }

  if (reason) {
    response.reason(reason);
  }

  if (headers) {
    response.headers(headers);
  }

  if (body) {
    response.body(body);
  }

  return response;
}
