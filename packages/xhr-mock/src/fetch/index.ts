// import { Request, Response } from '../types';
import Router from '../router';

export class MockFetchRequest implements Request {}

export class MockFetchResponse implements Response {
  constructor(res: Response) {}

  readonly body: ReadableStream | null;
  readonly headers: Headers;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly type: ResponseType;
  readonly url: string;
  readonly redirected: boolean;
  clone(): Response;
}

export default function createFetchFunction(router: Router) {
  return async (
    urlOrRequest: string,
    options: {} = {}
  ): Promise<MockFetchResponse> => {
    const req = {
      method: options.method || 'get',
      uri: urlOrRequest
    };
    const res = await router.routeAsync(req);
    return new MockFetchResponse(res);
  };
}
