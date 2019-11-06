import {MockError} from './MockError';

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

  private name: string;
  private canBubble = false;
  private canCancel = false;
  private isPropagationStopped = false;
  private isImmediatePropagationStopped = false;
  private isCanceled = false;
  private isPassive = false;

  public readonly composed: boolean = false;

  public readonly currentTarget: EventTarget | null = null;
  public readonly srcElement: Element | null = null;
  public readonly target: EventTarget | null = null;

  public readonly eventPhase: number = EventPhase.NONE;
  public readonly isTrusted: boolean = false;
  public readonly timeStamp: number = Date.now();

  public constructor(type: string, eventInitDict?: EventInit) {
    this.name = type;
    if (eventInitDict) {
      const {
        bubbles = false,
        cancelable = false,
        composed = false,
      } = eventInitDict;
      this.canBubble = bubbles;
      this.canCancel = cancelable;
      this.composed = composed;
    }
  }

  public get type(): string {
    return this.name;
  }

  public get bubbles(): boolean {
    return this.canBubble;
  }

  public get cancelable(): boolean {
    return this.canCancel;
  }

  public get cancelBubble(): boolean {
    return this.isPropagationStopped;
  }

  public composedPath(): EventTarget[] {
    throw new MockError();
  }

  public get defaultPrevented(): boolean {
    return this.isCanceled;
  }

  public initEvent(type: string, bubbles = false, cancelable = false): void {
    this.name = type;
    this.canBubble = bubbles;
    this.canCancel = cancelable;
  }

  public preventDefault(): void {
    this.isCanceled = true;
  }

  public get returnValue(): boolean {
    return !this.isCanceled;
  }

  public set returnValue(value: boolean) {
    this.isCanceled = !value;
  }

  public stopImmediatePropagation(): void {
    this.isPropagationStopped = true;
    this.isImmediatePropagationStopped = true;
  }

  public stopPropagation(): void {
    this.isPropagationStopped = true;
  }
}
