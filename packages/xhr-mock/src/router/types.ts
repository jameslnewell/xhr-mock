export interface RequestQueryParams {
  [name: string]: string;
}

export interface RequestPathParams {
  [name: string]: string;
}

export interface Headers {
  [name: string]: string;
}

export interface Request {
  version: string;
  method: string;
  path: string;
  query: RequestQueryParams;
  params: RequestPathParams;
  headers: Headers;
  body: string | undefined;
}

export interface Response {
  version: string;
  status: number;
  reason: string;
  headers: Headers;
  body: string | undefined;
}

export type Path = string | RegExp;

export type Callback = (
  req: Request
) => Partial<Response> | undefined | Promise<Partial<Response> | undefined>;
