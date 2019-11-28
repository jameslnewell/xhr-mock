import {matchURLQuery} from './matchURLQuery';
import {normaliseRequest} from '../normalise';

const req = normaliseRequest({
  url: 'http://localhost/user/jameslnewell?foo=bar&bar=foo',
});

describe('matchURLQuery()', () => {
  test('returns undefined when the request url is not a match for the query pattern', () => {
    expect(matchURLQuery({blah: 'blah'}, req)).toBeUndefined();
  });

  test('returns the query when the request url is a match for the query pattern', () => {
    expect(matchURLQuery({foo: 'bar'}, req)).toEqual({foo: 'bar'});
  });
});
