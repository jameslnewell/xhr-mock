import MockEvent from './MockEvent';
import MockErrorEvent from './MockErrorEvent';
import MockProgressEvent from './MockProgressEvent';
import MockEventTarget from './MockEventTarget';

export default class MockXMLHttpRequestEventTarget extends MockEventTarget
  implements XMLHttpRequestEventTarget {
  onabort: (this: XMLHttpRequestEventTarget, ev: Event) => any;
  onerror: (this: XMLHttpRequestEventTarget, ev: ErrorEvent) => any;
  onload: (this: XMLHttpRequestEventTarget, ev: Event) => any;
  onloadend: (this: XMLHttpRequestEventTarget, ev: ProgressEvent) => any;
  onloadstart: (this: XMLHttpRequestEventTarget, ev: Event) => any;
  onprogress: (this: XMLHttpRequestEventTarget, ev: ProgressEvent) => any;
  ontimeout: (this: XMLHttpRequestEventTarget, ev: ProgressEvent) => any;
}
