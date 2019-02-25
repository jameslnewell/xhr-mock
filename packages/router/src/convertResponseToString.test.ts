import {convertResponseToString} from './convertResponseToString';

const minimalResponse = {
  version: '1.1',
  status: 200,
  reason: 'OK',
  headers: {},
  body: undefined
};

describe('convertResponseToString()', () => {
  it('should have no headers and no body', () => {
    const response = {
      ...minimalResponse
    };
    const expected = `HTTP/1.1 200 OK\n\n`;
    expect(convertResponseToString(response)).toEqual(expected);
  });

  it('should have headers', () => {
    const response = {
      ...minimalResponse,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    };
    const expected = `HTTP/1.1 200 OK\nContent-Type: application/json; charset=UTF-8\n\n`;
    expect(convertResponseToString(response)).toEqual(expected);
  });

  it('should have a body', () => {
    const response = {
      ...minimalResponse,
      body: '<html></html>'
    };
    const expected = `HTTP/1.1 200 OK

<html></html>`;
    expect(convertResponseToString(response)).toEqual(expected);
  });

  it('should have headers and a body', () => {
    const response = {
      ...minimalResponse,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: '<html></html>'
    };
    const expected = `HTTP/1.1 200 OK\nContent-Type: application/json; charset=UTF-8\n\n<html></html>`;
    expect(convertResponseToString(response)).toEqual(expected);
  });
});
