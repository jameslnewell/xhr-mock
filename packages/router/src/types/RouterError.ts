export class RouterError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, RouterError.prototype);
  }
}
