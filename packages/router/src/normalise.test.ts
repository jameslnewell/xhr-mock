import {normaliseRequest, normaliseResponse} from './normalise';

describe('normaliseRequest()', () => {
  it('should set the default version', () => {
    const req = {};
    expect(normaliseRequest(req)).toMatchObject({
      version: '1.1'
    });
  });

  it('should set the default method', () => {
    const req = {};
    expect(normaliseRequest(req)).toMatchObject({
      method: 'GET'
    });
  });

  it('should set the default uri', () => {
    const req = {};
    expect(normaliseRequest(req)).toMatchObject({
      uri: '/'
    });
  });

  it('should set the default headers', () => {
    const req = {};
    expect(normaliseRequest(req)).toMatchObject({
      headers: {}
    });
  });

  it('should set the default body', () => {
    const req = {};
    expect(normaliseRequest(req)).toMatchObject({
      body: undefined
    });
  });

  it('should uppercase the method', () => {
    const req = {method: 'post'};
    expect(normaliseRequest(req)).toMatchObject({
      method: 'POST'
    });
  });

  it('should lowercase the headers', () => {
    const req = {headers: {'Content-Type': 'application/json'}};
    expect(normaliseRequest(req)).toMatchObject({
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
