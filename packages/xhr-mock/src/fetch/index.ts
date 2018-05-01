// import { Request, Response } from '../types';
import {MockRouter} from '../router';

export class MockBody implements Body {
  readonly bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(0));
  }
  blob(): Promise<Blob> {
    return Promise.resolve(new Blob());
  }
  json(): Promise<any> {
    return Promise.resolve();
  }
  text(): Promise<string> {
    return Promise.resolve('');
  }
  formData(): Promise<FormData> {
    return Promise.resolve(new FormData());
  }
}

export class MockFetchRequest extends MockBody implements Request {
  readonly cache: RequestCache;
  readonly credentials: RequestCredentials;
  readonly destination: RequestDestination;
  readonly headers: Headers;
  readonly integrity: string;
  readonly keepalive: boolean;
  readonly method: string;
  readonly mode: RequestMode;
  readonly redirect: RequestRedirect;
  readonly referrer: string;
  readonly referrerPolicy: ReferrerPolicy;
  readonly type: RequestType;
  readonly url: string;
  readonly signal: AbortSignal;
  clone(): Request {
    return new MockFetchRequest();
  }
}

export class MockFetchResponse extends MockBody implements Response {
  readonly body: ReadableStream | null;
  readonly headers: Headers;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly type: ResponseType;
  readonly url: string;
  readonly redirected: boolean;
  clone(): Response {
    return new MockFetchResponse();
  }
}

export default function createFetchFunction(router: MockRouter) {
  return async (input: RequestInfo, init?: RequestInit): Promise<MockFetchResponse> => {
    const req = {
      method: (init && init.method) || 'get',
      uri: typeof input === 'string' ? input : input.destination
    };
    const res = await router.routeAsync(req, {});
    return new MockFetchResponse();
  };
}
