import {MockFunction, MockObject} from '../types';
import {createResponseFromObject} from '../createResponseFromObject';

export function sequence(mocks: (MockFunction | MockObject)[]): MockFunction {
  let callCount = 0;

  return (req, res) => {
    if (callCount < mocks.length) {
      const mock = mocks[callCount++];
      return typeof mock === 'function'
        ? mock(req, res)
        : createResponseFromObject(mock);
    }
  };
}
