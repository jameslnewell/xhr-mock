export default class XHRMockError extends Error {
  constructor(message?: string) {
    super(`xhr-mock: ${message}`);
  }
}
