import {Router} from '../Router';

const noop = (): undefined => undefined;

export const createMockRouter = (): Router => {
  return new Router().on('after', noop).on('error', noop);
};
