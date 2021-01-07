import {Mock, MockObject, MockFunction} from './types';
import {formatURL} from './MockURL';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';
import {createResponseFromObject} from './createResponseFromObject';

const URL_SLIPT_QUERY_REGEX = /^([^\?]+)?/g;

const LAST_SLASH_URL_REGEX = /\/$/;

export default function(
  method: string,
  url: string | RegExp,
  mock: Mock
): MockFunction {
  const matches = (req: MockRequest) => {
    const requestMethod = req.method();
    const requestURL = req.url().toString();

    if (requestMethod.toUpperCase() !== method.toUpperCase()) {
      return false;
    }

    if (url instanceof RegExp) {
      url.lastIndex = 0; //reset state of global regexp
      return url.test(requestURL);
    }

    const matchRequestUrl = requestURL.match(URL_SLIPT_QUERY_REGEX);

    if (matchRequestUrl) {
      const [splitUrl] = matchRequestUrl;
      return (
        splitUrl.replace(LAST_SLASH_URL_REGEX, '') ===
        url.replace(LAST_SLASH_URL_REGEX, '')
      );
    }

    return false;
  };

  return (req, res) => {
    if (matches(req)) {
      if (typeof mock === 'object') {
        return createResponseFromObject(mock);
      } else {
        return mock(req, res);
      }
    }
  };
}
