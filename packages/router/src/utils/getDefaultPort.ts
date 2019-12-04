import {URL} from 'whatwg-url';

export function getDefaultPort(url: URL): number | undefined {
  const port = parseInt(url.port, 10);
  if (!isNaN(port)) {
    return port;
  }
  if (url.protocol === 'https:') {
    return 443;
  }
  if (url.protocol === 'http:') {
    return 80;
  }
  return undefined;
}
