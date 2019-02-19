import {parse, format} from 'url';

export interface MockURL {
  protocol?: string;
  username?: string;
  password?: string;
  host?: string;
  port?: number;
  path?: string;
  query?: {[name: string]: string};
  hash?: string;
  toString(): string;
}

// put toString() in a class so it isn't included in the props when checked for equality
class MockURLImplementation implements MockURL {
  toString(): string {
    return formatURL(this);
  }
}

export function parseURL(url: string): MockURL {
  const urlObject: MockURL = new MockURLImplementation();

  if (!url) {
    return urlObject;
  }

  const parsedURL = parse(url, true);

  if (parsedURL.protocol) {
    urlObject.protocol = parsedURL.protocol.substr(0, parsedURL.protocol.length - 1);
  }

  if (parsedURL.auth) {
    const [username, password] = parsedURL.auth.split(':');
    if (username && password) {
      urlObject.username = username;
      urlObject.password = password;
    } else {
      urlObject.username = username;
    }
  }

  if (parsedURL.hostname) {
    urlObject.host = parsedURL.hostname;
  }

  if (parsedURL.port) {
    urlObject.port = parseInt(parsedURL.port, 10);
  }

  if (parsedURL.pathname) {
    urlObject.path = parsedURL.pathname;
  }

  if (parsedURL.query) {
    urlObject.query = parsedURL.query;
  }

  if (parsedURL.hash) {
    urlObject.hash = parsedURL.hash;
  }

  return urlObject;
}

export function formatURL(url: MockURL): string {
  const obj = {
    protocol: url.protocol,
    auth: url.username && url.password ? `${url.username}:${url.password}` : url.username,
    hostname: url.host,
    port: typeof url.port === 'number' ? String(url.port) : url.port,
    pathname: url.path,
    query: url.query,
    hash: url.hash
  };
  return format(obj);
}
