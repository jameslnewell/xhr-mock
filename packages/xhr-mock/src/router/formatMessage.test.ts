import {formatMessage} from './formatMessage';
import {Request, Response} from '../types';

describe('formatMessage()', () => {
  it('should contain the request string', () => {
    const req = {
      version: '1.1',
      method: 'GET',
      uri: '/foo/bar',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: new Blob()
    };
    const err = new Error('Uh oh!');

    const formatted = formatMessage(
      'None of the registered handlers returned a response',
      {
        req,
        err
      }
    );

    expect(formatted).toContain('GET /foo/bar HTTP/1.1');
    expect(formatted).toContain(
      'Content-Type: application/json; charset=UTF-8'
    );
  });

  it('should contain the response string', () => {
    const req = {
      version: '1.1',
      method: 'GET',
      uri: '/foo/bar',
      headers: {},
      body: undefined
    };
    const res = {
      version: '1.1',
      status: 200,
      reason: 'OK',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: new Blob()
    };

    const formatted = formatMessage(
      'None of the registered handlers returned a response',
      {
        req,
        res
      }
    );

    expect(formatted).toContain('HTTP/1.1 200 OK');
    expect(formatted).toContain(
      'Content-Type: application/json; charset=UTF-8'
    );
  });

  it('should contain the error message and stack trace', () => {
    const req = {
      version: '1.1',
      method: 'GET',
      uri: '/foo/bar',
      headers: {},
      body: undefined
    };
    const err = new Error('Uh oh!');

    const formatted = formatMessage(
      'None of the registered handlers returned a response',
      {
        req,
        err
      }
    );

    expect(formatted).toContain('Uh oh');
    expect(formatted).toContain('formatMessage.test.ts');
  });
});
