import {MockFunction, MockObject} from '../types';
import {sequence} from './sequence';

export function once(mock: MockFunction | MockObject): MockFunction {
  return sequence([mock]);
}
