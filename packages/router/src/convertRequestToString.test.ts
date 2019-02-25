import {convertRequestToString} from './convertRequestToString';

const minimalRequest = {
  version: '1.1',
  method: 'GET',
  uri: '/',
  headers: {},
  body: undefined
};

describe('convertRequestToString()', () => {
  it('should have no headers and no body', () => {
    const request = {
      ...minimalRequest
    };
    const expected = `GET / HTTP/1.1\n\n`;
    expect(convertRequestToString(request)).toEqual(expected);
  });

  it('should have headers', () => {
    const request = {
      ...minimalRequest,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: undefined
    };
    const expected = `GET / HTTP/1.1\nContent-Type: application/json; charset=UTF-8\n\n`;
    expect(convertRequestToString(request)).toEqual(expected);
  });

  it('should have a body', () => {
    const request = {
      ...minimalRequest,
      body: '<html></html>'
    };
    const expected = `GET / HTTP/1.1\n\n<html></html>`;
    expect(convertRequestToString(request)).toEqual(expected);
  });

  it('should have headers and a body', () => {
    const request = {
      ...minimalRequest,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: '<html></html>'
    };
    const expected = `GET / HTTP/1.1\nContent-Type: application/json; charset=UTF-8\n\n<html></html>`;
    expect(convertRequestToString(request)).toEqual(expected);
  });
});
