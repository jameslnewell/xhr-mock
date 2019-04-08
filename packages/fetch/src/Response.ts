import {Headers} from './Headers';
import {Body} from './Body';

export class Response extends Body implements Response {
  public readonly headers: Headers = new Headers();
  public readonly redirected: boolean;
  public readonly status: number;
  public readonly statusText: string;
  public readonly trailer: Promise<Headers>;
  public readonly type: ResponseType;
  public readonly url: string;

  public constructor(body?: BodyInit | undefined, options: ResponseInit = {}) {
    super(body);
    const {status = 200, statusText = '', headers} = options;
    this.status = status;
    this.statusText = statusText;
    this.headers = new Headers(headers);
  }

  public clone(): Response {
    return new Response(this.bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers
    });
  }

  public get ok(): boolean {
    return this.status >= 200 && this.status < 300;
  }
}
