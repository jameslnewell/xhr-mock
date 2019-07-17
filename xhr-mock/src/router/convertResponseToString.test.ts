import {convertResponseToString} from './convertResponseToString';

describe('convertResponseToString()', () => {
  it('should have no headers and no body', () => {
    const res = {
      version: '1.1',
      status: 200,
      reason: 'OK',
      headers: {},
      body: undefined,
    };
    const out = `HTTP/1.1 200 OK

`;
    expect(convertResponseToString(res)).toEqual(out);
  });

  it('should have headers', () => {
    const res = {
      version: '1.1',
      status: 200,
      reason: 'OK',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: undefined,
    };
    const out = `HTTP/1.1 200 OK
Content-Type: application/json; charset=UTF-8

`;
    expect(convertResponseToString(res)).toEqual(out);
  });

  it('should have a body', () => {
    const res = {
      version: '1.1',
      status: 200,
      reason: 'OK',
      headers: {},
      body: '<html></html>',
    };
    const out = `HTTP/1.1 200 OK

<html></html>`;
    expect(convertResponseToString(res)).toEqual(out);
  });

  it('should have headers and a body', () => {
    const res = {
      version: '1.1',
      status: 200,
      reason: 'OK',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: '<html></html>',
    };
    const out = `HTTP/1.1 200 OK
Content-Type: application/json; charset=UTF-8

<html></html>`;
    expect(convertResponseToString(res)).toEqual(out);
  });
});
