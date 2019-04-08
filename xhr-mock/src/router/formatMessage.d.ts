import {MockRequest, MockResponse} from './types';
export declare function formatMessage(
  msg: string,
  {
    req,
    res,
    err
  }: {
    req: MockRequest;
    res?: MockResponse;
    err?: Error;
  }
): string;
