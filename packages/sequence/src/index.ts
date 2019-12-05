import {Response, Middleware} from '@xhr-mock/router';

export default function sequence(
  responsesOrMiddlewares: Array<Partial<Response> | Middleware>,
): Middleware {
  let calls = 0;
  return (req, res) => {
    const mock = responsesOrMiddlewares[calls++];
    return typeof mock === 'function' ? mock(req, res) : mock;
  };
}
