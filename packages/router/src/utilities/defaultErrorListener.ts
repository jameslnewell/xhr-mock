import {ErrorEvent, RouterError} from '../types';
import {formatMessage} from '../formatters/formatMessage';

export function defaultErrorListener(event: ErrorEvent): void {
  const {request, error} = event;
  if (error instanceof RouterError) {
    // FIXME: need to specify dom or node env to get this working
    // eslint-disable-next-line no-console
    console.error(formatMessage(error.message, {request}));
  } else {
    // FIXME: need to specify dom or node env to get this working
    // eslint-disable-next-line no-console
    console.error(
      formatMessage('A middleware returned an error for the request.', {
        request,
        error,
      }),
    );
  }
}
