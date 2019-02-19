import {MockEvent} from './MockEvent';

export class MockProgressEvent extends MockEvent implements ProgressEvent {
  readonly lengthComputable: boolean;
  readonly loaded: number;
  readonly total: number;

  constructor(type: string, eventInitDict?: ProgressEventInit) {
    super(type, eventInitDict);
    if (eventInitDict) {
      const {lengthComputable = false, loaded = 0, total = 0} = eventInitDict;
      this.lengthComputable = lengthComputable;
      this.loaded = loaded;
      this.total = total;
    }
  }

  initProgressEvent(
    typeArg: string,
    canBubbleArg: boolean,
    cancelableArg: boolean,
    lengthComputableArg: boolean,
    loadedArg: number,
    totalArg: number
  ): void {
    throw new Error();
  }
}
