import {MockHeaders} from './MockHeaders';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';

export {MockHeaders};

export type MockObject = {
  status?: number;
  reason?: string;
  headers?: MockHeaders;
  body?: any;
};

export type MockFunction = (
  request: MockRequest,
  response: MockResponse
) => undefined | MockResponse | Promise<undefined | MockResponse>;

export type Mock = MockObject | MockFunction;

export interface ErrorCallbackEvent {
  req: MockRequest;
  err: Error;
}
