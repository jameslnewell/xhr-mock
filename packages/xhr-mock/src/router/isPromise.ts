export default function isPromise(val: any): val is Promise<any> {
  return val && typeof (val as Promise<any>).then !== 'undefined';
}
