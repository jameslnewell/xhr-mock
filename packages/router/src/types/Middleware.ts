import {Request} from './Request';
import {Response} from './Response';
import {Context} from './Context';

export interface Middleware<
  R extends Request = Request,
  C extends Context = Context
> {
  (request: R, context: C):
    | undefined
    | Partial<Response>
    | Promise<Partial<Response> | undefined>;
}
