import {MockError} from './MockError';

export class NotImplementedError extends MockError {
  constructor() {
    super(
      `This feature hasn't been implemented yet. Please raise an issue and consider submitting a pull request on Github.`,
    );
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}
