export * from './types';
import proxy from './proxy';
import MockFacade from './MockFacade';

export {proxy};
export default new MockFacade();
