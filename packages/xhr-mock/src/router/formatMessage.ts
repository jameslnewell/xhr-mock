import {MockRequest, MockResponse} from './types';
import {convertRequestToString} from './convertRequestToString';
import {convertResponseToString} from './convertResponseToString';

function indentLines(string: string, indent: number): string {
  return string
    .split('\n')
    .map((line, index) => Array(indent + 1).join(' ') + line)
    .join('\n');
}

function formatRequest(req: MockRequest) {
  return indentLines(convertRequestToString(req).trim(), 4);
}

function formatResponse(res: MockResponse) {
  return indentLines(convertResponseToString(res).trim(), 4);
}

function formatError(err: Error): string {
  return indentLines(
    (err && err.stack) || (err && err.message) || `Error: ${err}`,
    4
  );
}

export function formatMessage(
  msg: string,
  {req, res, err}: {req: MockRequest; res?: MockResponse; err?: Error}
) {
  return `xhr-mock: ${msg}

${formatRequest(req)}
${res ? `\n${formatResponse(res)}` : ''}${err ? `\n${formatError(err)}` : ''}
`;
}
