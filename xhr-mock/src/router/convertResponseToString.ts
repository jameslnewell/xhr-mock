import {MockResponse} from './types';

export function convertResponseToString(res: MockResponse): string {
  const headers = Object.keys(res.headers).map(
    name => `${name}: ${res.headers[name]}`,
  );
  const bodyLine = `\n${res.body ? res.body : ''}`;
  return `HTTP/${res.version} ${res.status} ${res.reason}
${headers.length ? `${headers.join('\n')}\n` : ''}${bodyLine}`;
}
