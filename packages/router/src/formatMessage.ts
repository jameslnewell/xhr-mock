import {Request, Response} from './types';
import {convertRequestToString} from './convertRequestToString';
import {convertResponseToString} from './convertResponseToString';

function indentLines(content: string, indent: number): string {
  return content
    .split('\n')
    .map((line, index) => Array(indent + 1).join(' ') + line)
    .join('\n');
}

function formatRequest(request: Request) {
  return indentLines(convertRequestToString(request).trim(), 4);
}

function formatResponse(response: Response) {
  return indentLines(convertResponseToString(response).trim(), 4);
}

function formatError(error: Error): string {
  return indentLines(
    (error && error.stack) || (error && error.message) || `Error: ${error}`,
    4,
  );
}

export function formatMessage(
  msg: string,
  {
    request,
    response,
    error,
  }: {request: Request; response?: Response; error?: Error},
) {
  return `xhr-mock: ${msg}

${formatRequest(request)}
${response ? `\n${formatResponse(response)}` : ''}${
    error ? `\n${formatError(error)}` : ''
  }
`;
}
