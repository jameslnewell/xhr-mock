import {AfterEvent} from './types';
import {formatMessage} from '../../xhr-mock/src/router/formatMessage';

export function afterLogger(event: AfterEvent) {
  const {request, response} = event;
  // tslint:disable no-console
  console.info(formatMessage('A middleware returned a response for the request.', {request, response}));
}
