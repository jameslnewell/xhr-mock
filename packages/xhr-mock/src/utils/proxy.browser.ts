import XHRMock from './XHRMock';
import {MockRequest, MockResponse, MockContextWithSync} from '../router';

function setHeaders(req: MockRequest, xhr: XMLHttpRequest): void {
  Object.keys(req.headers).forEach(name => {
    const value = req.headers[name];
    xhr.setRequestHeader(name, value);
  });
}

function parseHeaders(string: String): {} {
  const headers: {[name: string]: string} = {};
  const lines = string.split('\r\n');
  lines.forEach(line => {
    const [name, value] = line.split(':', 2);
    if (name && value) {
      headers[name] = value.replace(/^\s*/g, '').replace(/\s*$/g, '');
    }
  });
  return headers;
}

function getResponse(xhr: XMLHttpRequest): Partial<MockResponse> {
  return {
    status: xhr.status,
    reason: xhr.statusText,
    headers: parseHeaders(xhr.getAllResponseHeaders()),
    body: xhr.response
  };
}

export function proxy(
  req: MockRequest,
  ctx: MockContextWithSync
): Partial<MockResponse> | Promise<Partial<MockResponse>> {
  const xhr: XMLHttpRequest = new XHRMock.RealXMLHttpRequest();
  if (ctx.sync) {
    xhr.open(req.method, req.uri);
    setHeaders(req, xhr);
    xhr.send(req.body());
    return getResponse(xhr);
  } else {
    return new Promise((resolve, reject) => {
      xhr.onerror = () => reject();
      xhr.onloadend = () => resolve(getResponse(xhr));
      xhr.open(req.method, req.uri);
      setHeaders(req, xhr);
      xhr.send(req.body());
    });
  }
}
