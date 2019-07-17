// TODO: finish implementation

function createNotImplementedError() {
  return new Error('Not implemented yet.');
}

function createBodyConversionError() {
  return new Error('Body conversion not implemented yet.');
}

export class Body {
  protected readonly bodyInit: BodyInit | undefined;
  private isBodyUsed: boolean = false;

  protected constructor(bodyInit?: BodyInit) {
    this.bodyInit = bodyInit;
  }

  public get body(): ReadableStream<Uint8Array> | null {
    throw createNotImplementedError();
    return null;
  }

  public get bodyUsed(): boolean {
    return this.isBodyUsed;
  }

  public async arrayBuffer(): Promise<ArrayBuffer> {
    throw createNotImplementedError();
    return new ArrayBuffer(0);
  }

  public async blob(): Promise<Blob> {
    throw createNotImplementedError();
  }

  public async formData(): Promise<FormData> {
    throw createNotImplementedError();
  }

  public async json(): Promise<any> {
    const text = await this.text();
    return JSON.parse(text);
  }

  public async text(): Promise<string> {
    // TODO:
    if (
      typeof this.bodyInit !== 'undefined' &&
      typeof this.bodyInit !== 'string'
    ) {
      throw createBodyConversionError();
    }
    this.isBodyUsed = true;
    return typeof this.bodyInit !== 'undefined' ? this.bodyInit : '';
  }
}
