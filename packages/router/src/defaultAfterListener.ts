import {AfterEvent} from './types';
import {formatMessage} from './formatMessage';

export function afterLogger<C>(event: AfterEvent<C>) {
  const {request, response} = event;
  // tslint:disable no-console
  // @ts-ignore
  console.info(
    formatMessage('A middleware returned a response for the request.', {
      request,
      response,
    }),
  );
}
