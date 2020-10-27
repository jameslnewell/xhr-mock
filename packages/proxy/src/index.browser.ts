import {Request, Response, Middleware, Mode} from '@xhr-mock/router';

function setHeaders(req: Request, xhr: XMLHttpRequest): void {
  Object.keys(req.headers).forEach((name) => {
    const value = req.headers[name];
    xhr.setRequestHeader(name, value);
  });
}

function parseHeaders(content: string): Record<string, string> {
  const headers: {[name: string]: string} = {};
  const lines = content.split('\r\n');
  lines.forEach((line) => {
    const [name, value] = line.split(':', 2);
    if (name && value) {
      headers[name] = value.replace(/^\s*/g, '').replace(/\s*$/g, '');
    }
  });
  return headers;
}

function getResponse(xhr: XMLHttpRequest): Partial<Response> {
  return {
    status: xhr.status,
    reason: xhr.statusText,
    headers: parseHeaders(xhr.getAllResponseHeaders()),
    body: xhr.response,
  };
}

export function proxy(): Middleware {
  return (request, context) => {
    const xhr: XMLHttpRequest = new context.XMLHttpRequest();
    if (context.mode === Mode.SYNC) {
      xhr.open(request.method, request.url);
      setHeaders(request, xhr);
      xhr.send(request.body);
      return getResponse(xhr);
    } else {
      return new Promise((resolve, reject) => {
        xhr.onerror = () => reject();
        xhr.onloadend = () => resolve(getResponse(xhr));
        xhr.open(request.method, request.url);
        setHeaders(request, xhr);
        xhr.send(request.body);
      });
    }
  };
}
