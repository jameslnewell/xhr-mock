import {MockResponse, MockURICriteria, MockHandler} from './types';
export declare function createHandler(
  method: string,
  uri: MockURICriteria,
  handlerOrResponse: MockHandler | Partial<MockResponse>
): MockHandler;
