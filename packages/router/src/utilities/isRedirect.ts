import {Response} from '../types';

export function isRedirect(response: Response): boolean {
  return [301, 308, 302, 303, 307].includes(response.status);
}
