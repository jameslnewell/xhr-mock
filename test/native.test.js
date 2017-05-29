import mock from '../src';

const example = () =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        return resolve(xhr.text);
      }
    };
    xhr.onerror = reject;
    xhr.open('POST', '/example');
    xhr.send();
  });

describe('native', () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());

  it('should send a POST request', () => {
    mock.mock((req, res) => {
      expect(req.method()).toEqual('POST');
      expect(req.url().toString()).toEqual('/example');
      return res;
    });

    return example();
  });
});
