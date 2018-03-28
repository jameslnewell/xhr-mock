import window = require('global');
import {
  Request,
  Response,
  MethodMatch,
  URIMatch,
  RouteHandler,
  BeforeRouteCallback,
  AfterRouteCallback,
  ErrorRouteCallback
} from './types';
import MockError from './MockError';
import MockRouter from './router/Router';
import MockXMLHttpRequest from './xhr/MockXMLHttpRequest';

const RealXMLHttpRequest = window.XMLHttpRequest;

export default class MockFacade {
  RealXMLHttpRequest: {new (): XMLHttpRequest} = RealXMLHttpRequest;

  router: MockRouter = new MockRouter();

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

  before(callback: BeforeRouteCallback): MockFacade {
    this.router.before(callback);
    return this;
  }

  after(callback: AfterRouteCallback): MockFacade {
    this.router.after(callback);
    return this;
  }

  error(callback: ErrorRouteCallback): MockFacade {
    this.router.error(callback);
    return this;
  }

  use(handler: RouteHandler): MockFacade;
  use(
    method: MethodMatch,
    uri: URIMatch,
    handler: RouteHandler | Partial<Response>
  ): MockFacade;
  use(
    methodOrHandler: MethodMatch | RouteHandler,
    uri?: URIMatch,
    handlerOrResponse?: RouteHandler | Partial<Response>
  ): MockFacade {
    if (
      typeof methodOrHandler === 'string' &&
      (typeof uri === 'string' || uri instanceof RegExp) &&
      handlerOrResponse !== undefined
    ) {
      if (typeof handlerOrResponse === 'function') {
        this.router.use(methodOrHandler, uri, handlerOrResponse);
      } else {
        this.router.use(methodOrHandler, uri, handlerOrResponse);
      }
    } else if (typeof methodOrHandler === 'function') {
      this.router.use(methodOrHandler);
    } else {
      throw new MockError('Invalid handler.');
    }
    return this;
  }

  get(
    uri: URIMatch,
    handlerOrResponse: RouteHandler | Partial<Response>
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
    uri: URIMatch,
    handlerOrResponse: RouteHandler | Partial<Response>
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
    uri: URIMatch,
    handlerOrResponse: RouteHandler | Partial<Response>
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
    uri: URIMatch,
    handlerOrResponse: RouteHandler | Partial<Response>
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
    uri: URIMatch,
    handlerOrResponse: RouteHandler | Partial<Response>
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
