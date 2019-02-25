export enum Mode {
  SYNC,
  ASYNC
}

export interface Headers {
  [name: string]: string;
}

export interface Parameters {
  [name: string]: string;
}

export interface Request {
  version: string;
  method: string;
  uri: string;
  params: Parameters;
  headers: Headers;
  body: any;
}

export interface Response {
  version: string;
  status: number;
  reason: string;
  headers: Headers;
  body: any;
}

export interface Context {
  mode: Mode;
}

export type MethodPattern = '*' | string;
export type PathPattern = string | RegExp;

export type Middleware = (
  request: Request,
  context: Context
) => Partial<Response> | undefined | Promise<Partial<Response> | undefined>;

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
  error: any;
}
