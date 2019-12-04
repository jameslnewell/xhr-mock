export type MethodPattern = '*' | string;
export type URLPathPattern = string | RegExp;
export type URLObjectPattern = {
  protocol?: string;
  host?: string;
  port?: number;
  path?: string;
  query?: Record<string, string>;
};
export type URLPattern = URLObjectPattern | URLPathPattern;
