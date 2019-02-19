import MockResponse from './MockResponse';

export function isPromiseLike(arg: any): arg is Promise<MockResponse | undefined> {
  return arg && (arg as Promise<MockResponse | undefined>).then !== undefined;
}
