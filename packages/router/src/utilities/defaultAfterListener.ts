import {AfterEvent} from '../types';
import {formatMessage} from '../formatters/formatMessage';

export function defaultAfterListener(event: AfterEvent): void {
  const {request, response} = event;
  // eslint-disable-next-line no-console
  console.info(
    formatMessage('A middleware returned a response for the request.', {
      request,
      response,
    }),
  );
}
