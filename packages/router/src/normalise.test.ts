import {normaliseRequest, normaliseResponse} from './normalise';

describe('normaliseRequest()', () => {
  it('should set the default version', () => {
    const request = {};
    expect(normaliseRequest(request)).toMatchObject({
      version: '1.1'
    });
  });

  it('should set the default method', () => {
    const request = {};
    expect(normaliseRequest(request)).toMatchObject({
      method: 'GET'
    });
  });

  it('should set the default url', () => {
    const request = {};
    expect(normaliseRequest(request)).toMatchObject({
      url: '/'
    });
  });

  it('should set the default parameters', () => {
    const request = {};
    expect(normaliseRequest(request)).toMatchObject({
      params: {}
    });
  });

  it('should set the default headers', () => {
    const request = {};
    expect(normaliseRequest(request)).toMatchObject({
      headers: {}
    });
  });

  it('should set the default body', () => {
    const request = {};
    expect(normaliseRequest(request)).toMatchObject({
      body: undefined
    });
  });

  it('should uppercase the method', () => {
    const request = {method: 'post'};
    expect(normaliseRequest(request)).toMatchObject({
      method: 'POST'
    });
  });

  it('should lowercase the headers', () => {
    const request = {headers: {'Content-Type': 'application/json'}};
    expect(normaliseRequest(request)).toMatchObject({
      headers: {'content-type': 'application/json'}
    });
  });
});

describe('normaliseResponse()', () => {
  it('should set the default version', () => {
    const res = {};
    expect(normaliseResponse(res)).toMatchObject({
      version: '1.1'
    });
  });

  it('should set the default status', () => {
    const res = {};
    expect(normaliseResponse(res)).toMatchObject({
      status: 200
    });
  });

  it('should set the default reason', () => {
    const res = {};
    expect(normaliseResponse(res)).toMatchObject({
      reason: 'OK'
    });
  });

  it('should set the default headers', () => {
    const res = {};
    expect(normaliseResponse(res)).toMatchObject({
      headers: {}
    });
  });

  it('should set the default body', () => {
    const res = {};
    expect(normaliseResponse(res)).toMatchObject({
      body: undefined
    });
  });

  it('should set the default reason based on the status', () => {
    const res = {status: 204};
    expect(normaliseResponse(res)).toMatchObject({
      reason: 'No Content'
    });
  });

  it('should set the reason', () => {
    const res = {status: 204, reason: 'Other'};
    expect(normaliseResponse(res)).toMatchObject({
      reason: 'Other'
    });
  });

  it('should lowercase the headers', () => {
    const res = {headers: {'Content-Type': 'application/json'}};
    expect(normaliseResponse(res)).toMatchObject({
      headers: {'content-type': 'application/json'}
    });
  });
});
