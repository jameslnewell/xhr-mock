import {Response} from './Response';

export interface RouteResult extends Response {
  url: string;
  redirected: boolean;
}
