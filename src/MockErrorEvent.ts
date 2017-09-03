import MockEvent from './MockEvent';

export default class MockErrorEvent extends MockEvent implements ErrorEvent {
  readonly colno: number;
  readonly error: any;
  readonly filename: string;
  readonly lineno: number;
  readonly message: string;

  constructor(type: string, eventInitDict?: ErrorEventInit) {
    super(type, eventInitDict);
    if (eventInitDict) {
      const {
        message = '',
        filename = '',
        lineno = 0,
        colno = 0,
        error = null
      } = eventInitDict;
      this.message = message;
      this.filename = filename;
      this.lineno = lineno;
      this.colno = colno;
      this.error = error;
    }
  }

  initErrorEvent(
    typeArg: string,
    canBubbleArg: boolean,
    cancelableArg: boolean,
    messageArg: string,
    filenameArg: string,
    linenoArg: number
  ): void {
    throw new Error();
  }
}
