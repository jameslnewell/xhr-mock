import {Headers} from './Headers';

describe('Headers', () => {
  describe('.constructor()', () => {
    it('should have a header when an object is passed', () => {
      const headers = new Headers({'content-type': 'text/html'});
      expect(headers.has('content-type')).toBeTruthy();
      expect(headers.get('content-type')).toEqual('text/html');
    });

    it('should have a header when an array is passed', () => {
      const headers = new Headers([['content-type', 'text/html']]);
      expect(headers.has('content-type')).toBeTruthy();
      expect(headers.get('content-type')).toEqual('text/html');
    });

    it('should have a header when an instance is passed', () => {
      const headers = new Headers(new Headers({'content-type': 'text/html'}));
      expect(headers.has('content-type')).toBeTruthy();
      expect(headers.get('content-type')).toEqual('text/html');
    });

    it('should not have a header when not passed', () => {
      const headers = new Headers();
      expect(headers.has('content-type')).toBeFalsy();
      expect(headers.get('content-type')).toBeNull();
    });
  });

  describe('.set()', () => {
    it('should set the value when the header does not exist', () => {
      const headers = new Headers();
      headers.set('content-type', 'text/html');
      expect(headers.has('content-type')).toBeTruthy();
      expect(headers.get('content-type')).toEqual('text/html');
    });

    it('should replace the value when the header already exists', () => {
      const headers = new Headers();
      headers.set('content-type', 'text/html');
      headers.set('content-type', 'text/javascript');
      expect(headers.has('content-type')).toBeTruthy();
      expect(headers.get('content-type')).toEqual('text/javascript');
    });
  });

  describe('.append()', () => {
    it('should set the value when the header does not exist', () => {
      const headers = new Headers();
      headers.append('content-type', 'text/html');
      expect(headers.has('content-type')).toBeTruthy();
      expect(headers.get('content-type')).toEqual('text/html');
    });

    it('should append the value when the header already exists', () => {
      const headers = new Headers();
      headers.append('content-type', 'text/html');
      headers.append('content-type', 'text/javascript');
      expect(headers.has('content-type')).toBeTruthy();
      expect(headers.get('content-type')).toEqual('text/html, text/javascript');
    });
  });

  describe('.delete()', () => {
    it('should delete a header when the header does exist', () => {
      const headers = new Headers({'content-type': 'text/html'});
      headers.delete('content-type');
      expect(headers.has('content-type')).toBeFalsy();
      expect(headers.get('content-type')).toBeNull();
    });

    it('should delete a header when the header does not exist', () => {
      const headers = new Headers();
      headers.delete('content-type');
      expect(headers.has('content-type')).toBeFalsy();
      expect(headers.get('content-type')).toBeNull();
    });
  });

  describe('.forEach()', () => {
    it('should iterate over each of the headers', () => {
      const fn = jest.fn();
      const headers = new Headers({
        a: '1',
        b: '2',
        c: '3'
      });
      headers.forEach(fn);
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn.mock.calls).toEqual([
        expect.arrayContaining(['1', 'a']),
        expect.arrayContaining(['2', 'b']),
        expect.arrayContaining(['3', 'c'])
      ]);
    });
  });
});
