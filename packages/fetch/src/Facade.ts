import window = require('global');
import Router, {
  Mode,
  Request as RouterRequest,
  Context,
} from '@xhr-mock/router';
import {Headers} from './Headers';
import {Request} from './Request';
import {Response} from './Response';

export class Facade {
  private fns: {
    fetch: GlobalFetch['fetch'];
    Headers: Headers;
    Request: Request;
    Response: Response;
  }[] = [];
  public router: Router | undefined = undefined;

  public setup(): void {
    // save the original function
    this.fns.push({
      fetch: window.fetch,
      Headers: window.Headers,
      Request: window.Request,
      Response: window.Response,
    });
    // apply the mock function
    window.fetch = this.fetch;
    window.Headers = this.fetch;
    window.fetch = this.fetch;
    // TODO: all the other classes
  }

  public teardown(): void {
    // restore the original function
    const fns = this.fns.pop();
    if (!fns) {
      return;
    }
    window.fetch = fns.fetch;
    window.Headers = fns.Headers;
    window.Request = fns.Request;
    window.Response = fns.Response;
  }

  private fetch: GlobalFetch['fetch'] = async (
    input: RequestInfo,
    init?: RequestInit,
  ): Promise<Response> => {
    if (!this.router) {
      throw new Error('No router!');
    }

    let request: Partial<RouterRequest>;
    const context: Partial<Context> = {
      mode: Mode.ASYNC,
    };
    if (typeof input === 'string') {
      request = {
        url: input,
      };
    } else {
      request = {
        method: input.method,
        url: input.url,
        body: await input.text(), // FIXME:
        // TODO: other fields
      };
      input.headers.forEach((val, nm) => {
        if (!request.headers) {
          request.headers = {};
        }
        request.headers[nm] = val;
      });
    }

    // TODO: set values from init
    if (init) {
      if (init.method) {
        request.method = init.method;
      }
      if (init.body) {
        request.body = init.body;
      }
    }

    // route the request to a response
    const response = await this.router.handleAsync(request, context);

    // create a response object
    return new Response(response.body, {
      status: response.status,
      statusText: response.reason,
      headers: response.headers,
    });
  };
}
