export function isPromise<T = any>(val: Promise<T> | any): val is Promise<T> {
  return val && typeof (val as Promise<T>).then !== 'undefined';
}
