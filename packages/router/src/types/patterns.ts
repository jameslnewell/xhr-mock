export type MethodPattern = '*' | string;
export type URLPattern = {
  protocol?: string;
  host?: string;
  port?: number;
  path?: string;
  query?: Record<string, string>;
};
export type URLPathPattern = string | RegExp | Array<string | RegExp>;
