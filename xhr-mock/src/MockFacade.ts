import window = require('global');
import {
  MockRequest,
  MockResponse,
  MockMethodCriteria,
  MockURLCriteria,
  MockHandler,
  MockBeforeCallback,
  MockAfterCallback,
  MockErrorCallback,
  MockRouter,
} from './router';
import {MockError} from './MockError';
import {MockXMLHttpRequest} from './xhr/MockXMLHttpRequest';

const RealXMLHttpRequest = window.XMLHttpRequest;

export class MockFacade {
  RealXMLHttpRequest: {new (): XMLHttpRequest} = RealXMLHttpRequest;

  private router: MockRouter = new MockRouter();

  setup(): MockFacade {
    // replace the real methods
    // @ts-ignore: https://github.com/jameslnewell/xhr-mock/issues/45
    window.XMLHttpRequest = MockXMLHttpRequest;

    // remove the registered handlers
    this.router.clear();

    return this;
  }

  teardown(): MockFacade {
    // remove the registered handlers
    this.router.clear();

    // put the real methods back
    window.XMLHttpRequest = RealXMLHttpRequest;

    return this;
  }

  reset(): MockFacade {
    this.router.clear();
    return this;
  }

  before(callback: MockBeforeCallback): MockFacade {
    this.router.before(callback);
    return this;
  }

  after(callback: MockAfterCallback): MockFacade {
    this.router.after(callback);
    return this;
  }

  error(callback: MockErrorCallback): MockFacade {
    this.router.error(callback);
    return this;
  }

  use(handler: MockHandler): MockFacade;
  use(
    method: MockMethodCriteria,
    uri: MockURLCriteria,
    handlerOrResponse: MockHandler | Partial<MockResponse>,
  ): MockFacade;
  use(
    methodOrHandler: MockMethodCriteria | MockHandler,
    url?: MockURLCriteria,
    handlerOrResponse?: MockHandler | Partial<MockResponse>,
  ): MockFacade {
    if (
      typeof methodOrHandler === 'string' &&
      (typeof url === 'string' || url instanceof RegExp) &&
      handlerOrResponse !== undefined
    ) {
      if (typeof handlerOrResponse === 'function') {
        this.router.use(methodOrHandler, url, handlerOrResponse);
      } else {
        this.router.use(methodOrHandler, url, handlerOrResponse);
      }
    } else if (typeof methodOrHandler === 'function') {
      this.router.use(methodOrHandler);
    } else {
      // TODO: will the compiler even let us get here?
      throw new MockError('Invalid handler.');
    }
    return this;
  }

  get(
    uri: MockURLCriteria,
    handlerOrResponse: MockHandler | Partial<MockResponse>,
  ): MockFacade {
    if (typeof handlerOrResponse === 'function') {
      this.router.get(uri, handlerOrResponse);
      return this;
    } else {
      this.router.get(uri, handlerOrResponse);
      return this;
    }
  }

  post(
    uri: MockURLCriteria,
    handlerOrResponse: MockHandler | Partial<MockResponse>,
  ): MockFacade {
    if (typeof handlerOrResponse === 'function') {
      this.router.post(uri, handlerOrResponse);
      return this;
    } else {
      this.router.post(uri, handlerOrResponse);
      return this;
    }
  }

  put(
    uri: MockURLCriteria,
    handlerOrResponse: MockHandler | Partial<MockResponse>,
  ): MockFacade {
    if (typeof handlerOrResponse === 'function') {
      this.router.put(uri, handlerOrResponse);
      return this;
    } else {
      this.router.put(uri, handlerOrResponse);
      return this;
    }
  }

  patch(
    uri: MockURLCriteria,
    handlerOrResponse: MockHandler | Partial<MockResponse>,
  ): MockFacade {
    if (typeof handlerOrResponse === 'function') {
      this.router.patch(uri, handlerOrResponse);
      return this;
    } else {
      this.router.patch(uri, handlerOrResponse);
      return this;
    }
  }

  delete(
    uri: MockURLCriteria,
    handlerOrResponse: MockHandler | Partial<MockResponse>,
  ): MockFacade {
    if (typeof handlerOrResponse === 'function') {
      this.router.delete(uri, handlerOrResponse);
      return this;
    } else {
      this.router.delete(uri, handlerOrResponse);
      return this;
    }
  }
}
