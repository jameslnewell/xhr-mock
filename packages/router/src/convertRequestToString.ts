import {MockRequest} from './types';

export function convertRequestToString(req: MockRequest): string {
  const headers = Object.keys(req.headers).map(name => `${name}: ${req.headers[name]}`);
  const bodyLine = `\n${req.body ? req.body : ''}`;
  return `${req.method} ${req.uri} HTTP/${req.version}
${headers.length ? `${headers.join('\n')}\n` : ''}${bodyLine}`;
}
