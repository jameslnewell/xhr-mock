export interface Headers {
  [name: string]: string;
}

export interface Request {
  version: string;
  method: string;
  uri: string;
  headers: Headers;
  body: string | undefined;
}

export interface RequestParams {
  [name: string]: string;
}

export interface RequestWithParams extends Request {
  params: RequestParams;
}

export interface Response {
  version: string;
  status: number;
  reason: string;
  headers: Headers;
  body: string | undefined;
}

export interface Context {
  async: boolean;
}

export type MethodMatch = string;
export type URIMatch = string | RegExp;

export type RouteHandler = (
  req: Request,
  ctx: Context
) => Partial<Response> | undefined | Promise<Partial<Response> | undefined>;

export type BeforeRouteEvent = { req: Request };
export type BeforeRouteCallback = (event: BeforeRouteEvent) => void;

export type AfterRouteEvent = { req: Request; res: Response };
export type AfterRouteCallback = (event: AfterRouteEvent) => void;

export type ErrorRouteEvent = { req: Request; err: Error };
export type ErrorRouteCallback = (event: ErrorRouteEvent) => void;

