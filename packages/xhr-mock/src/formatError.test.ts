import {formatError} from './formatError';
import MockRequest from './MockRequest';

describe('formatError()', () => {
  it('should contain the request string', () => {
    const req = new MockRequest()
      .method('get')
      .url('/foo/bar')
      .header('Content-Type', 'application/json; charset=UTF-8')
      .body(new Blob());
    const err = new Error('Uh oh!');

    const formatted = formatError(
      'None of the registered handlers returned a response',
      req,
      err
    );

    expect(formatted).toContain('GET /foo/bar HTTP/1.1');
    expect(formatted).toContain(
      'content-type: application/json; charset=UTF-8'
    );
  });

  it('should contain the error message and stack trace', () => {
    const req = new MockRequest().method('get').url('/foo/bar');
    const err = new Error('Uh oh!');

    const formatted = formatError(
      'None of the registered handlers returned a response',
      req,
      err
    );

    expect(formatted).toContain('Uh oh');
    expect(formatted).toContain('formatError.test.ts');
  });
});
