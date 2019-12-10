export class MockXMLHttpRequestEventTarget
  implements XMLHttpRequestEventTarget {
  private listeners?: {
    [type: string]: EventListenerOrEventListenerObject[];
  } = {};

  /* eslint-disable @typescript-eslint/no-explicit-any */
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
  /* eslint-enable @typescript-eslint/no-explicit-any */

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
    // @ts-ignore
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.listeners = this.listeners || {};

    if (!listener) {
      return;
    }

    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    //handleEvent
    if (this.listeners[type].indexOf(listener) === -1) {
      this.listeners[type].push(listener);
    }

    // TODO: handle once
    // TODO: handle passive
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
    // @ts-ignore
    options?: boolean | EventListenerOptions,
  ): void {
    this.listeners = this.listeners || {};

    if (!listener) {
      return;
    }

    if (!this.listeners[type]) {
      return;
    }

    const index = this.listeners[type].indexOf(listener);
    if (index !== -1) {
      this.listeners[type].splice(index, 1);
    }

    // TODO: handle once
    // TODO: handle passive
  }

  public dispatchEvent(event: Event): boolean {
    this.listeners = this.listeners || {};

    /* eslint-disable @typescript-eslint/no-explicit-any */
    //set the event target
    (event as any).target = this;
    (event as any).currentTarget = this;

    //call any built-in listeners
    //FIXME: the listener should be added on set
    const method = (this as any)[`on${event.type}`];
    /* eslint-enable @typescript-eslint/no-explicit-any */
    if (method) {
      method.call(this, event);
    }

    if (!this.listeners[event.type]) {
      return true;
    }

    this.listeners[event.type].forEach(listener => {
      if (typeof listener === 'function') {
        listener.call(this, event);
      } else {
        listener.handleEvent.call(this, event);
      }
    });
    return true; //TODO: return type based on .cancellable and .preventDefault()
  }
}
