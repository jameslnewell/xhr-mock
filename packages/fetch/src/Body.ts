// TODO: finish implementation

function createNotImplementedError(): Error {
  return new Error('Not implemented yet.');
}

function createBodyConversionError(): Error {
  return new Error('Body conversion not implemented yet.');
}

export class Body {
  protected readonly bodyInit: BodyInit | undefined;
  private isBodyUsed = false;

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
