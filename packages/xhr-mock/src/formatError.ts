import {ErrorCallbackEvent} from './types';
import MockRequest from './MockRequest';

function convertRequestToString(req: MockRequest): string {
  const headers = Object.keys(req.headers()).map(
    name => `${name}: ${req.header(name)}`
  );
  const body = req.body() ? req.body() : '';
  return `${req.method()} ${req.url()} HTTP/1.1
${headers ? `${headers.join('\n')}\n` : ''}
${body ? body : ''}
`;
}

function indentSuccessiveLines(string: string, indent: number): string {
  return string
    .split('\n')
    .map((line, index) => Array(indent + 1).join(' ') + line)
    .join('\n');
}

export function formatError(msg: string, req: MockRequest, err?: Error) {
  return `xhr-mock: ${msg}

  ${indentSuccessiveLines(convertRequestToString(req), 2).trim()}
  ${
    err !== undefined
      ? `\n${indentSuccessiveLines(
          (err && err.stack) || (err && err.message) || `Error: ${err}`,
          2
        )}`
      : ''
  }
`;
}
