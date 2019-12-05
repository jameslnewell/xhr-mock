import {formatMessage} from './formatMessage';

const message = 'None of the registered handlers returned a response';

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

const response = {
  version: '1.1',
  status: 200,
  reason: 'OK',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
  body: '',
};

const error = new Error('Uh oh!');

describe('formatMessage()', () => {
  test('should contain the request string', () => {
    const formatted = formatMessage(message, {
      request,
      error,
    });
    expect(formatted).toContain('GET /foo/bar HTTP/1.1');
    expect(formatted).toContain(
      'Content-Type: application/json; charset=UTF-8',
    );
  });

  test('should contain the response string', () => {
    const formatted = formatMessage(message, {
      request,
      response,
    });
    expect(formatted).toContain('HTTP/1.1 200 OK');
    expect(formatted).toContain(
      'Content-Type: application/json; charset=UTF-8',
    );
  });

  test('should contain the error message and stack trace', () => {
    const formatted = formatMessage(message, {
      request,
      error,
    });
    expect(formatted).toContain('Uh oh');
    expect(formatted).toContain('formatMessage.tests.ts');
  });
});
