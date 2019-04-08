export interface MockHeaders {
  [name: string]: string;
}
export interface MockRequest {
  version: string;
  method: string;
  uri: string;
  headers: MockHeaders;
  body: any;
}
export interface MockRequestParams {
  [name: string]: string;
}
export interface MockRequestWithParams extends MockRequest {
  params: MockRequestParams;
}
export interface MockResponse {
  version: string;
  status: number;
  reason: string;
  headers: MockHeaders;
  body: any;
}
export interface MockContext {}
export interface MockContextWithSync {
  sync: boolean;
}
export declare type MockMethodCriteria = string;
export declare type MockURICriteria = string | RegExp;
export declare type MockHandler = (
  req: MockRequest,
  ctx: MockContextWithSync
) => Partial<MockResponse> | undefined | Promise<Partial<MockResponse> | undefined>;
export declare type MockBeforeCallbackEvent = {
  req: MockRequest;
  ctx: MockContextWithSync;
};
export declare type MockBeforeCallback = (event: MockBeforeCallbackEvent) => void;
export declare type MockAfterCallbackEvent = {
  req: MockRequest;
  res: MockResponse;
  ctx: MockContextWithSync;
};
export declare type MockAfterCallback = (event: MockAfterCallbackEvent) => void;
export declare type MockErrorCallbackEvent = {
  req: MockRequest;
  err: Error;
  ctx: MockContextWithSync;
};
export declare type MockErrorCallback = (event: MockErrorCallbackEvent) => void;
