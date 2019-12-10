import {URL} from 'whatwg-url';
import {Request, Response, Headers} from '../types';
import {normaliseRequest} from './normalise';

function getLocation(request: Request, response: Response): undefined | string {
  const location = Array.isArray(response.headers.location)
    ? response.headers.location[0]
    : response.headers.location;
  if (!location) {
    return undefined;
  }
  const url = new URL(location, request.url);
  return url.href;
}

/**
 * Strip headers relating to the message body
 * @param headers
 */
function stripBodyHeaders(headers: Headers): Headers {
  return Object.keys(headers).reduce((newHeaders, name) => {
    if (name.toLowerCase().startsWith('content-')) {
      return newHeaders;
    } else {
      return {
        ...newHeaders,
        [name]: headers[name],
      };
    }
  }, {});
}

/**
 * Create a new request if the response is a redirect
 * @param request   The original request
 * @param response  The original response
 */
export function getRedirectRequest(
  request: Request,
  response: Response,
): Request | undefined {
  if (response.status < 300 || response.status >= 400) {
    return undefined;
  }

  const location = getLocation(request, response);
  if (!location) {
    return undefined;
  }

  if (response.status === 303) {
    return normaliseRequest({
      method: 'GET',
      headers: stripBodyHeaders(request.headers),
      url: location,
    });
  }

  return normaliseRequest({
    ...request,
    url: location,
  });
}
