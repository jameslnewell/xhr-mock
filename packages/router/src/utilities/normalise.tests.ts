import {normaliseRequest, normaliseResponse} from './normalise';

describe('normaliseRequest()', () => {
  test('should set the default version', () => {
    const request = {};
    expect(normaliseRequest(request)).toMatchObject({
      version: '1.1',
    });
  });

  test('should set the default method', () => {
    const request = {};
    expect(normaliseRequest(request)).toMatchObject({
      method: 'GET',
    });
  });

  test('should set the default url', () => {
    const request = {};
    expect(normaliseRequest(request)).toMatchObject({
      url: '/',
    });
  });

  test('should set the default headers', () => {
    const request = {};
    expect(normaliseRequest(request)).toMatchObject({
      headers: {},
    });
  });

  test('should set the default body', () => {
    const request = {};
    expect(normaliseRequest(request)).toMatchObject({
      body: undefined,
    });
  });

  test('should uppercase the method', () => {
    const request = {method: 'post'};
    expect(normaliseRequest(request)).toMatchObject({
      method: 'POST',
    });
  });

  test('should lowercase the headers', () => {
    const request = {headers: {'Content-Type': 'application/json'}};
    expect(normaliseRequest(request)).toMatchObject({
      headers: {'content-type': 'application/json'},
    });
  });
});

describe('normaliseResponse()', () => {
  test('should set the default version', () => {
    const res = {};
    expect(normaliseResponse(res)).toMatchObject({
      version: '1.1',
    });
  });

  test('should set the default status', () => {
    const res = {};
    expect(normaliseResponse(res)).toMatchObject({
      status: 200,
    });
  });

  test('should set the default reason', () => {
    const res = {};
    expect(normaliseResponse(res)).toMatchObject({
      reason: 'OK',
    });
  });

  test('should set the default headers', () => {
    const res = {};
    expect(normaliseResponse(res)).toMatchObject({
      headers: {},
    });
  });

  test('should set the default body', () => {
    const res = {};
    expect(normaliseResponse(res)).toMatchObject({
      body: undefined,
    });
  });

  test('should set the default reason based on the status', () => {
    const res = {status: 204};
    expect(normaliseResponse(res)).toMatchObject({
      reason: 'No Content',
    });
  });

  test('should set the reason', () => {
    const res = {status: 204, reason: 'Other'};
    expect(normaliseResponse(res)).toMatchObject({
      reason: 'Other',
    });
  });

  test('should lowercase the headers', () => {
    const res = {headers: {'Content-Type': 'application/json'}};
    expect(normaliseResponse(res)).toMatchObject({
      headers: {'content-type': 'application/json'},
    });
  });
});
