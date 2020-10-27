import {URL} from 'url';
import * as http from 'http';
import * as https from 'https';
import {MockError} from '../MockError';
import {Request, Response, Context} from '@xhr-mock/router';

export function proxy(req: Request, ctx: Context): Promise<Partial<Response>> {
  if (!ctx.isAsynchronous) {
    throw new MockError(
      'Synchronus requests are not supported by proxy() in NodeJS.',
    );
  }

  return new Promise((resolve, reject) => {
    const urlinfo = new URL(req.url);

    const options = {
      method: req.method,
      // protocol: `${urlinfo.protocol}:`,
      hostname: urlinfo.host,
      port: urlinfo.port,
      auth: `${urlinfo.username} ${urlinfo.password}`,
      path: urlinfo.pathname,
      headers: req.headers,
    };

    const createRequest =
      urlinfo.protocol === 'https:' ? https.request : http.request;

    const proxyRequest = createRequest(options, proxyResponse => {
      let body = '';
      proxyResponse.setEncoding('utf8');
      proxyResponse.on('data', chunk => {
        body += chunk.toString();
      });
      proxyResponse.on('end', () => {
        console.log('END');
        resolve({
          status: proxyResponse.statusCode,
          reason: proxyResponse.statusMessage,
          headers: Object.keys(proxyResponse.headers).reduce(
            (
              accum: {[name: string]: string | string[] | undefined},
              name: string,
            ) => {
              accum[name] = proxyResponse.headers[name];
              return accum;
            },
            {},
          ),
          body: body,
        });
      });
    });

    proxyRequest.on('error', reject);

    const reqBody = req.body;
    if (reqBody !== undefined && reqBody !== null) {
      proxyRequest.write(reqBody);
    }
    proxyRequest.end();
  });
}
