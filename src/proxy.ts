import * as http from 'http';
import * as https from 'https';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';

export default function(
  req: MockRequest,
  res: MockResponse
): Promise<MockResponse> {
  return new Promise((resolve, reject) => {
    const options = {
      method: req.method(),
      protocol: `${req.url().protocol}:`,
      hostname: req.url().host,
      port: req.url().port,
      auth: `${req.url().username} ${req.url().password}`,
      path: req.url().path,
      headers: req.headers()
    };

    const requestFn =
      req.url().protocol === 'https' ? https.request : http.request;

    const httpReq = requestFn(options, httpRes => {
      res.status(httpRes.statusCode || 0).reason(httpRes.statusMessage || '');

      Object.keys(httpRes.headers).forEach(name => {
        const value = httpRes.headers[name];
        res.header(name, Array.isArray(value) ? value[0] : value || '');
      });

      let resBody = '';
      httpRes.setEncoding('utf8');
      httpRes.on('data', chunk => {
        resBody += chunk.toString();
      });
      httpRes.on('end', () => {
        res.body(resBody);
        resolve(res);
      });
    });

    httpReq.on('error', reject);

    const reqBody = req.body();
    if (reqBody !== undefined && reqBody !== null) {
      httpReq.write(reqBody);
    }
    httpReq.end();
  });
}
