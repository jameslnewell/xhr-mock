import {Request} from '../types';
import {convertRequestToString} from './convertRequestToString';

describe('convertRequestToString()', () => {
  it('should have no headers and no body', () => {
    const req = {
      version: '1.1',
      method: 'GET',
      uri: '/',
      headers: {},
      body: undefined
    };
    const out = `GET / HTTP/1.1

`;
    expect(convertRequestToString(req)).toEqual(out);
  });

  it('should have headers', () => {
    const req = {
      version: '1.1',
      method: 'GET',
      uri: '/',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: undefined
    };
    const out = `GET / HTTP/1.1
Content-Type: application/json; charset=UTF-8

`;
    expect(convertRequestToString(req)).toEqual(out);
  });

  it('should have a body', () => {
    const req = {
      version: '1.1',
      method: 'GET',
      uri: '/',
      headers: {},
      body: '<html></html>'
    };
    const out = `GET / HTTP/1.1

<html></html>`;
    expect(convertRequestToString(req)).toEqual(out);
  });

  it('should have headers and a body', () => {
    const req = {
      version: '1.1',
      method: 'GET',
      uri: '/',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: '<html></html>'
    };
    const out = `GET / HTTP/1.1
Content-Type: application/json; charset=UTF-8

<html></html>`;
    expect(convertRequestToString(req)).toEqual(out);
  });
});
