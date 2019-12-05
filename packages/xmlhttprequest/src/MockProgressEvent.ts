import {MockEvent} from './MockEvent';

export class MockProgressEvent extends MockEvent implements ProgressEvent {
  public readonly lengthComputable: boolean = false;
  public readonly loaded: number = 0;
  public readonly target: EventTarget | null = null;
  public readonly total: number = 0;

  constructor(type: string, eventInitDict?: ProgressEventInit) {
    super(type, eventInitDict);
    if (eventInitDict) {
      const {lengthComputable, loaded, total} = eventInitDict;

      if (lengthComputable !== undefined) {
        this.lengthComputable = lengthComputable;
      }

      if (loaded !== undefined) {
        this.loaded = loaded;
      }

      if (total !== undefined) {
        this.total = total;
      }
    }
  }
}
