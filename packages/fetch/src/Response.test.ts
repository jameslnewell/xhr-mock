import {Response} from './Response';

describe('Response', () => {
  describe('.ok()', () => {
    it('should return true when status is 200', () => {
      const response = new Response('', {status: 200});
      expect(response.ok).toBeTruthy();
    });

    it('should return true when status is 201', () => {
      const response = new Response('', {status: 201});
      expect(response.ok).toBeTruthy();
    });

    it('should return true when status is 299', () => {
      const response = new Response('', {status: 299});
      expect(response.ok).toBeTruthy();
    });

    it('should return false when status is 100', () => {
      const response = new Response('', {status: 100});
      expect(response.ok).toBeFalsy();
    });

    it('should return false when status is 300', () => {
      const response = new Response('', {status: 300});
      expect(response.ok).toBeFalsy();
    });
  });
});
