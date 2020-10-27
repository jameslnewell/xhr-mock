/* eslint-disable @typescript-eslint/no-explicit-any */
import {MockEvent} from './MockEvent';

const flattenOptions = (
  options: undefined | boolean | AddEventListenerOptions,
): {capture: boolean; passive: boolean; once: boolean} => {
  return {
    capture:
      options === true ||
      (typeof options === 'object' && options.capture) ||
      false,
    passive: (typeof options === 'object' && options.passive) || false,
    once: (typeof options === 'object' && options.passive) || false,
  };
};

export class MockXMLHttpRequestEventTarget
  implements XMLHttpRequestEventTarget {
  private listeners?: {
    [type: string]: {
      listener: EventListenerOrEventListenerObject;
      capture: boolean;
      passive: boolean;
      once: boolean;
    }[];
  } = {};

  public onabort:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;
  public onerror:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;
  public onload:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;
  public onloadend:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;
  public onloadstart:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;
  public onprogress:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;
  public ontimeout:
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null = null;

  addEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(
    type: K,
    listener: (
      this: XMLHttpRequestEventTarget,
      ev: XMLHttpRequestEventTargetEventMap[K],
    ) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.listeners = this.listeners || {};

    if (!listener) {
      return;
    }

    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    if (this.listeners[type].findIndex((l) => l.listener === listener) === -1) {
      this.listeners[type].push({
        listener,
        ...flattenOptions(options),
      });
    }
  }

  removeEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(
    type: K,
    listener: (
      this: XMLHttpRequestEventTarget,
      ev: XMLHttpRequestEventTargetEventMap[K],
    ) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.listeners = this.listeners || {};

    if (!listener) {
      return;
    }

    if (!this.listeners[type]) {
      return;
    }

    const {capture} = flattenOptions(options);
    const index = this.listeners[type].findIndex(
      (l) => l.listener === listener && l.capture === capture,
    );
    if (index !== -1) {
      this.listeners[type].splice(index, 1);
    }
  }

  public dispatchEvent(event: Event): boolean {
    this.listeners = this.listeners || {};

    (event as any).eventPhase = MockEvent.AT_TARGET;
    (event as any).target = this;
    (event as any).currentTarget = this;

    //call any built-in listeners
    //FIXME: the listener should be added on set
    const method = (this as any)[`on${event.type}`];
    if (method) {
      method.call(this, event);
    }

    const listeners = this.listeners[event.type];
    if (!listeners) {
      return true;
    }

    listeners.forEach((l, index) => {
      // FIXME: handle event stopped
      if (event.stopPropagation)
        if (typeof l.listener === 'function') {
          l.listener.call(this, event);
        } else {
          l.listener.handleEvent.call(this, event);
        }
      if (l.once) {
        listeners.splice(index, 1);
      }
    });

    (event as any).eventPhase = MockEvent.NONE;
    (event as any).target = null;
    (event as any).currentTarget = null;

    return !event.defaultPrevented;
  }
}
