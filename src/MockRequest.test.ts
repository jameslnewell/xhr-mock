import MockEventTarget from './MockEventTarget';
import MockRequest from './MockRequest';

describe('MockRequest', function() {
  describe('.method()', () => {
    it('should be an empty string when not set', () => {
      const req = new MockRequest();
      expect(req.method()).toEqual('GET');
    });

    it('should be post when set', () => {
      const req = new MockRequest();
      req.method('POST');
      expect(req.method()).toEqual('POST');
    });

    it('should be uppercase when set', () => {
      const req = new MockRequest();
      req.method('put');
      expect(req.method()).toEqual('PUT');
    });

    it('should be chicken when set', () => {
      const req = new MockRequest();
      req.method('chicken');
      expect(req.method()).toEqual('chicken');
    });

    it('should return the request when the value is set', () => {
      const req = new MockRequest();
      expect(req.method('PUT')).toBe(req);
    });
  });

  describe('.url()', () => {
    it('should be an empty object when not set', () => {
      const req = new MockRequest();
      expect(req.url()).toEqual({});
    });

    it('should be a URL when set', () => {
      const req = new MockRequest();
      req.url('http://www.example.com/test.php?a=1&b=2');
      expect(req.url()).toEqual(
        expect.objectContaining({
          protocol: 'http',
          host: 'www.example.com',
          path: '/test.php',
          query: {a: '1', b: '2'}
        })
      );
      expect(req.url().toString()).toEqual(
        'http://www.example.com/test.php?a=1&b=2'
      );
    });

    it('should return the request when the value is set', () => {
      const req = new MockRequest();
      expect(req.url('http://www.example.com/')).toBe(req);
    });
  });

  describe('.header()', () => {
    it('should be null when not set', () => {
      const req = new MockRequest();
      expect(req.header('content-type')).toEqual(null);
    });

    it('should be image/jpeg when set', () => {
      const req = new MockRequest();
      req.header('content-type', 'image/jpeg');
      expect(req.header('content-type')).toEqual('image/jpeg');
    });

    it('should return the request when the value is set', () => {
      const req = new MockRequest();
      expect(req.header('content-type', 'image/jpeg')).toBe(req);
    });
  });

  describe('.headers()', () => {
    it('should be an empty object when not set', () => {
      const req = new MockRequest();
      expect(req.headers()).toEqual({});
    });

    it('should be an empty object when not set', () => {
      const req = new MockRequest();
      req.headers({'content-type': 'image/jpeg'});
      expect(req.headers()).toEqual(
        expect.objectContaining({'content-type': 'image/jpeg'})
      );
    });

    it('should return the request when the value is set', () => {
      const req = new MockRequest();
      expect(req.headers({'content-type': 'image/jpeg'})).toBe(req);
    });
  });

  describe('.body()', () => {
    it('should be null when not set', () => {
      const req = new MockRequest();
      expect(req.body()).toEqual(null);
    });

    it('should be HelloWorld when set', () => {
      const req = new MockRequest();
      req.body('HelloWorld');
      expect(req.body()).toEqual('HelloWorld');
    });

    it('should return the request when the value is set', () => {
      const req = new MockRequest();
      expect(req.body('HelloWorld')).toBe(req);
    });
  });

  describe('.progress()', () => {
    it('should dispatch the progress event', done => {
      const target = new MockEventTarget();
      const req = new MockRequest(target);

      target.addEventListener('progress', event => {
        expect(event).toEqual(
          expect.objectContaining({
            lengthComputable: true,
            loaded: 15,
            total: 100
          })
        );

        done();
      });

      req.progress(true, 100, 15);
    });

    it('should return the request when the value is set', () => {
      const events = new MockEventTarget();
      const req = new MockRequest(events);
      expect(req.progress()).toBe(req);
    });
  });
});
