import MockRequest from './MockRequest';
import MockResponse from './MockResponse';

export type MockObject = {
  status: number;
  reason: string;
  headers: number;
  body: string;
};

export type MockFunction = (
  request: MockRequest,
  response: MockResponse
) => undefined | MockResponse | Promise<undefined | MockResponse>;

export type Mock = MockObject | MockFunction;
