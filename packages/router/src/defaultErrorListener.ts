import {ErrorEvent} from './types';
import {RouterError} from './RouterError';
import {formatMessage} from './formatMessage';

export function defaultErrorListener<C>(event: ErrorEvent<C>) {
  const {request, error} = event;
  if (error instanceof RouterError) {
    // tslint:disable: no-console
    // @ts-ignore - need to specify dom or node to get this working
    console.error(formatMessage(error.message, {request}));
    // tslint:enable: no-console
  } else {
    // tslint:disable: no-console
    // @ts-ignore - need to specify dom or node to get this workinge
    console.error(formatMessage('A middleware returned an error for the request.', {request, error}));
    // tslint:enable: no-console
  }
}
