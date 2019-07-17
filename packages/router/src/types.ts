export enum Mode {
  SYNC,
  ASYNC,
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
  url: string;
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

export type Context<C extends {} = {}> = {
  mode: Mode;
} & C;

export type MethodPattern = '*' | string;
export type PathPattern = string | RegExp;

export type Middleware<C extends {} = {}> = (
  request: Request,
  context: Context<C>,
) => Partial<Response> | undefined | Promise<Partial<Response> | undefined>;

export interface BeforeEvent<C extends {} = {}> {
  context: Context<C>;
  request: Request;
}

export interface AfterEvent<C extends {} = {}> {
  context: Context<C>;
  request: Request;
  response: Response;
}

export interface ErrorEvent<C extends {} = {}> {
  context: Context<C>;
  request: Request;
  error: any;
}
