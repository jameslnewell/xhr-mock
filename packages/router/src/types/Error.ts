export class Error extends globalThis.Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, Error.prototype);
  }
}
