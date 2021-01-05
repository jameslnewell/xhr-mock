export default class MockEvent implements Event {
  readonly bubbles: boolean;
  readonly cancelable: boolean;
  cancelBubble: boolean;
  readonly currentTarget: EventTarget;
  readonly defaultPrevented: boolean;
  readonly eventPhase: number = 0;
  readonly isTrusted: boolean;
  returnValue: boolean;
  readonly srcElement: Element | null;
  readonly target: EventTarget;
  readonly timeStamp: number;
  readonly type: string;
  readonly scoped: boolean;
  readonly composed: boolean;

  readonly AT_TARGET: number;
  readonly BUBBLING_PHASE: number;
  readonly CAPTURING_PHASE: number;
  readonly NONE: number;

  constructor(type: string, eventInitDict?: EventInit & {scoped?: boolean}) {
    this.type = type || '';
    if (eventInitDict) {
      const {
        scoped = false,
        bubbles = false,
        cancelable = false
      } = eventInitDict;
      this.scoped = scoped;
      this.bubbles = bubbles;
      this.cancelable = cancelable;
    }
  }

  initEvent(
    eventTypeArg: string,
    canBubbleArg: boolean,
    cancelableArg: boolean
  ): void {
    throw new Error();
  }

  preventDefault(): void {
    throw new Error();
  }

  stopImmediatePropagation(): void {
    throw new Error();
  }

  stopPropagation(): void {
    throw new Error();
  }

  deepPath(): EventTarget[] {
    throw new Error();
  }

  composedPath(): EventTarget[] {
    throw new Error('Method not implemented.');
  }
}
