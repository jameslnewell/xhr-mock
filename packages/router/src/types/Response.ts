import {Headers} from './Headers';

export interface Response {
  version: string;
  status: number;
  reason: string;
  headers: Headers;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  body: any; // TODO: Can we type this better?
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
