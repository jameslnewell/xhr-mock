import {Request} from './types';

export function convertRequestToString(request: Request): string {
  const headers = Object.keys(request.headers).map(name => `${name}: ${request.headers[name]}`);
  const methodLine = `${request.method} ${request.uri} HTTP/${request.version}\n`;
  const headerLine = headers.length ? `${headers.join('\n')}\n` : '';
  const bodyLine = `\n${request.body ? request.body : ''}`;
  return `${methodLine}${headerLine}${bodyLine}`;
}
