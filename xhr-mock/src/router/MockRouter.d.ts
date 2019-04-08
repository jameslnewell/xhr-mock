import {
  MockRequest,
  MockResponse,
  MockContext,
  MockMethodCriteria,
  MockURICriteria,
  MockHandler,
  MockBeforeCallback,
  MockAfterCallback,
  MockErrorCallback
} from './types';
export declare class MockRouter {
  private beforeHandlerCallback?;
  private afterHandlerCallback?;
  private handlerErrorCallback?;
  private handlers;
  clear(): this;
  before(callback: MockBeforeCallback): this;
  after(callback: MockAfterCallback): this;
  error(callback: MockErrorCallback): this;
  use(handler: MockHandler): MockRouter;
  use(method: MockMethodCriteria, uri: MockURICriteria, handler: MockHandler): MockRouter;
  use(method: MockMethodCriteria, uri: MockURICriteria, response: Partial<MockResponse>): MockRouter;
  get(uri: MockURICriteria, handler: MockHandler): MockRouter;
  get(uri: MockURICriteria, response: Partial<MockResponse>): MockRouter;
  post(uri: MockURICriteria, handler: MockHandler): MockRouter;
  post(uri: MockURICriteria, response: Partial<MockResponse>): MockRouter;
  put(uri: MockURICriteria, handler: MockHandler): MockRouter;
  put(uri: MockURICriteria, response: Partial<MockResponse>): MockRouter;
  patch(uri: MockURICriteria, handler: MockHandler): MockRouter;
  patch(uri: MockURICriteria, response: Partial<MockResponse>): MockRouter;
  delete(uri: MockURICriteria, handler: MockHandler): MockRouter;
  delete(uri: MockURICriteria, response: Partial<MockResponse>): MockRouter;
  routeSync(req: Partial<MockRequest>, ctx: MockContext): MockResponse;
  routeAsync(req: Partial<MockRequest>, ctx: MockContext): Promise<MockResponse>;
}
