export class MockError extends Error {
  constructor(message: string = '') {
    super(message);
    // hack to make instanceof work @see https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
    Object.setPrototypeOf(this, MockError.prototype);
  }
}
