// import {MockEvent} from './MockEvent';
// import {MockProgressEvent} from './MockProgressEvent';
import {MockEventTarget} from './MockEventTarget';

export class MockXMLHttpRequestEventTarget extends MockEventTarget
  implements XMLHttpRequestEventTarget {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public onabort: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  public onerror: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  public onload: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  public onloadend: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  public onloadstart: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  public onprogress: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  public ontimeout: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  // TODO:
  // addEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestEventTarget, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  // addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  // removeEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestEventTarget, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  // removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
