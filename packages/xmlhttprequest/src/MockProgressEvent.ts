import {MockEvent} from './MockEvent';

export class MockProgressEvent extends MockEvent implements ProgressEvent {
  public readonly lengthComputable: boolean;
  public readonly loaded: number;
  public readonly total: number;

  public constructor(type: string, eventInitDict?: ProgressEventInit) {
    super(type, eventInitDict);
    if (eventInitDict) {
      const {lengthComputable = false, loaded = 0, total = 0} = eventInitDict;
      this.lengthComputable = lengthComputable;
      this.loaded = loaded;
      this.total = total;
    }
  }
}
