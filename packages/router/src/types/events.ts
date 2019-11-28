import {Request} from './Request';
import {Response} from './Response';
import {Context} from './Context';

export interface BeforeEvent {
  context: Context;
  request: Request;
}

export interface AfterEvent {
  context: Context;
  request: Request;
  response: Response;
}

export interface ErrorEvent {
  context: Context;
  request: Request;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  error: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
