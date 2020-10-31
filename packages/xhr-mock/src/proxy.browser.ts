import XHRMock from './XHRMock';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';

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

export default function(
  req: MockRequest,
  res: MockResponse
): Promise<MockResponse> {
  return new Promise((resolve, reject) => {
    const xhr: XMLHttpRequest = new XHRMock.RealXMLHttpRequest();

    // TODO: reject with the correct type of error
    xhr.onerror = (event: ProgressEvent<EventTarget> & {error?: any}) =>
      reject(event.error);

    xhr.onloadend = () => {
      res
        .status(xhr.status)
        .reason(xhr.statusText)
        .headers(parseHeaders(xhr.getAllResponseHeaders()))
        .body(xhr.response);
      resolve(res);
    };

    xhr.open(req.method(), req.url().toString());

    const headers = req.headers();
    Object.keys(headers).forEach(name => {
      const value = headers[name];
      xhr.setRequestHeader(name, value);
    });

    xhr.send(req.body());
  });
}
