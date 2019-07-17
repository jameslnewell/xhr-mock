import {formatMessage} from './formatMessage';

describe('formatMessage()', () => {
  it('should contain the request string', () => {
    const request = {
      version: '1.1',
      method: 'GET',
      url: '/foo/bar',
      params: {},
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: '',
    };
    const err = new Error('Uh oh!');

    const formatted = formatMessage(
      'None of the registered handlers returned a response',
      {
        request,
        error: err,
      },
    );

    expect(formatted).toContain('GET /foo/bar HTTP/1.1');
    expect(formatted).toContain(
      'Content-Type: application/json; charset=UTF-8',
    );
  });

  it('should contain the response string', () => {
    const request = {
      version: '1.1',
      method: 'GET',
      url: '/foo/bar',
      params: {},
      headers: {},
      body: undefined,
    };
    const response = {
      version: '1.1',
      status: 200,
      reason: 'OK',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: '',
    };

    const formatted = formatMessage(
      'None of the registered handlers returned a response',
      {
        request,
        response,
      },
    );

    expect(formatted).toContain('HTTP/1.1 200 OK');
    expect(formatted).toContain(
      'Content-Type: application/json; charset=UTF-8',
    );
  });

  it('should contain the error message and stack trace', () => {
    const request = {
      version: '1.1',
      method: 'GET',
      url: '/foo/bar',
      params: {},
      headers: {},
      body: undefined,
    };
    const error = new Error('Uh oh!');

    const formatted = formatMessage(
      'None of the registered handlers returned a response',
      {
        request,
        error,
      },
    );

    expect(formatted).toContain('Uh oh');
    expect(formatted).toContain('formatMessage.test.ts');
  });
});
