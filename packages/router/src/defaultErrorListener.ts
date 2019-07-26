import {ErrorEvent} from './types';
import {RouterError} from './RouterError';
import {formatMessage} from './formatMessage';

export function defaultErrorListener<C>(event: ErrorEvent<C>): void {
  const {request, error} = event;
  if (error instanceof RouterError) {
    // eslint:disable-next-line
    // need to specify dom or node to get this working
    console.error(formatMessage(error.message, {request}));
  } else {
    // eslint:disable-next-line
    // need to specify dom or node to get this working
    console.error(
      formatMessage('A middleware returned an error for the request.', {
        request,
        error,
      }),
    );
  }
}
