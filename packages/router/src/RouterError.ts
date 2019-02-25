// @see https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work

export class RouterError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, RouterError.prototype);
  }
}
