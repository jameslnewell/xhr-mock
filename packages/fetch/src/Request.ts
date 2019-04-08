import {Headers} from './Headers';
import {Body} from './Body';

export class Request extends Body implements Request {
  public readonly cache: RequestCache;

  public readonly credentials: RequestCredentials;

  public readonly destination: RequestDestination;

  public readonly headers: Headers = new Headers();

  public readonly integrity: string;

  public readonly isHistoryNavigation: boolean;

  public readonly isReloadNavigation: boolean;

  public readonly keepalive: boolean;

  public readonly method: string = 'GET';

  public readonly mode: RequestMode;

  public readonly redirect: RequestRedirect;

  public readonly referrer: string;

  public readonly referrerPolicy: ReferrerPolicy;

  public readonly signal: AbortSignal;

  public readonly url: string;

  public constructor(input: RequestInfo, init?: RequestInit) {
    super((init && init.body) || undefined);
    if (typeof input === 'string') {
      this.url = input;
    } else {
      this.url = input.url;
      this.method = input.method;
      // TODO:
    }
  }

  public clone(): Request {
    return new Request(this.url, {
      method: this.method,
      body: this.body,
      mode: this.mode,
      credentials: this.credentials,
      cache: this.cache,
      redirect: this.redirect,
      referrer: this.referrer,
      integrity: this.integrity
    });
  }
}
