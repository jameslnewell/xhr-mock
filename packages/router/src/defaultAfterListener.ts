import {AfterEvent} from './types';
import {formatMessage} from './formatMessage';

export function afterLogger<C>(event: AfterEvent<C>): void {
  const {request, response} = event;
  // eslint:disable-next-line
  console.info(
    formatMessage('A middleware returned a response for the request.', {
      request,
      response,
    }),
  );
}
