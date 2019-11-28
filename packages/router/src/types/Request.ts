import {Headers} from './Headers';

export interface Request {
  version: string;
  method: string;
  url: string;
  headers: Headers;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  body: any; // TODO: Can we type this better?
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export interface RequestParameters {
  [name: string]: string;
}

export interface RequestWithParameters extends Request {
  params: RequestParameters;
}
