import {ErrorEvent} from './types';
import {RouterError} from './RouterError';
import {formatMessage} from './formatMessage';

export function defaultErrorListener<C>(event: ErrorEvent<C>): void {
  const {request, error} = event;
  if (error instanceof RouterError) {
    // need to specify dom or node to get this working
    // eslint-disable-next-line no-console
    console.error(formatMessage(error.message, {request}));
  } else {
    // need to specify dom or node to get this working
    // eslint-disable-next-line no-console
    console.error(
      formatMessage('A middleware returned an error for the request.', {
        request,
        error,
      }),
    );
  }
}
