import {Response} from './types';

export function convertResponseToString(response: Response): string {
  const headers = Object.keys(response.headers).map(
    name => `${name}: ${response.headers[name]}`,
  );
  const statusLine = `HTTP/${response.version} ${response.status} ${response.reason}\n`;
  const headerLine = headers.length ? `${headers.join('\n')}\n` : '';
  const bodyLine = `\n${response.body ? response.body : ''}`;
  return `${statusLine}${headerLine}${bodyLine}`;
}
