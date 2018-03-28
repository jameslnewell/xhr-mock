export * from './types';
import proxy from './proxy';
<<<<<<< HEAD
import {once} from './utils/once';
import {delay} from './utils/delay';

export default XHRMock;
export {MockRequest, MockResponse, proxy, once, delay};
=======
import MockFacade from './MockFacade';

export {proxy};
export default new MockFacade();
>>>>>>> refactoring
