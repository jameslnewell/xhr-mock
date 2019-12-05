import {matchURLQuery} from './matchURLQuery';
import {normaliseRequest} from '../utilities/normalise';

const req = normaliseRequest({
  url: 'http://localhost/user/jameslnewell?foo=bar&bar=foo',
});

describe('matchURLQuery()', () => {
  test('returns undefined when the request url does not match the query object', () => {
    expect(matchURLQuery({blah: 'blah'}, req)).toBeUndefined();
  });
  test('returns true when the request url matches the query object', () => {
    expect(matchURLQuery({foo: 'bar'}, req)).toBeTruthy();
  });
});
