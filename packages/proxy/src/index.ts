import * as url from 'url';
import * as http from 'http';
import * as https from 'https';
import {MockError} from '../MockError';
import {MockRequest, MockResponse, MockContextWithSync} from '../router';

export function proxy(
  req: MockRequest,
  ctx: MockContextWithSync,
): Promise<Partial<MockResponse>> {
  if (ctx.sync) {
    throw new MockError(
      'Synchronus requests are not supported by proxy() in NodeJS.',
    );
  }

  return new Promise((resolve, reject) => {
    const urlinfo = url.parse(req.url);

    const options = {
      method: req.method,
      // protocol: `${urlinfo.protocol}:`,
      hostname: urlinfo.host,
      port: urlinfo.port,
      auth: `${urlinfo.username} ${urlinfo.password}`,
      path: urlinfo.path,
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
