/**
 * The event object
 * @see https://dom.spec.whatwg.org/#event
 */
import {NotImplementedError} from './NotImplementedError';

export enum EventPhase {
  NONE = 0,
  CAPTURING_PHASE = 1,
  AT_TARGET = 2,
  BUBBLING_PHASE = 3,
}

export class MockEvent implements Event {
  public static readonly NONE: number = EventPhase.NONE;
  public static readonly CAPTURING_PHASE: number = EventPhase.CAPTURING_PHASE;
  public static readonly AT_TARGET: number = EventPhase.AT_TARGET;
  public static readonly BUBBLING_PHASE: number = EventPhase.BUBBLING_PHASE;

  public readonly NONE: number = EventPhase.NONE;
  public readonly CAPTURING_PHASE: number = EventPhase.CAPTURING_PHASE;
  public readonly AT_TARGET: number = EventPhase.AT_TARGET;
  public readonly BUBBLING_PHASE: number = EventPhase.BUBBLING_PHASE;

  readonly type: string;
  readonly bubbles: boolean;
  readonly cancelable: boolean;
  readonly composed: boolean;

  /** @deprecated */
  readonly srcElement: EventTarget | null = null;
  readonly target: EventTarget | null = null;
  readonly currentTarget: EventTarget | null = null;

  readonly eventPhase: number = EventPhase.NONE;
  readonly isTrusted: boolean = true;
  readonly timeStamp: number = Date.now();

  private isCanceled = false;
  private isPropagationStopped = false;
  // private isImmediatelyPropagationStopped = false;

  constructor(type: string, eventInitDict?: EventInit) {
    const {bubbles = false, cancelable = false, composed = false} =
      eventInitDict || {};
    this.type = type;
    this.timeStamp = Date.now();
    this.bubbles = bubbles;
    this.cancelable = cancelable;
    this.composed = composed;
  }

  public composedPath(): EventTarget[] {
    throw new NotImplementedError();
  }

  public initEvent(): void {
    throw new NotImplementedError();
  }

  public preventDefault(): void {
    if (this.cancelable) {
      this.isCanceled = true;
    }
  }

  public get defaultPrevented(): boolean {
    return this.isCanceled;
  }

  public get returnValue(): boolean {
    return !this.isCanceled;
  }

  public set returnValue(value: boolean) {
    if (value === false) {
      this.isCanceled = true;
    }
  }

  public stopPropagation(): void {
    this.isPropagationStopped = true;
  }

  public stopImmediatePropagation(): void {
    this.isPropagationStopped = true;
    // this.isImmediatelyPropagationStopped = true;
  }

  public get cancelBubble(): boolean {
    return this.isPropagationStopped;
  }

  public set cancelBubble(value: boolean) {
    if (value) {
      this.isPropagationStopped = true;
    }
  }
}
