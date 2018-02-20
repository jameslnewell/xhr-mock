import {expect} from 'chai';
import mock from 'xhr-mock';

describe('native', () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());

  it('should get a blob', done => {
    mock.get('/myfile.png', {
      body: new ArrayBuffer(0)
    });

    // sourced from https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
    const req = new XMLHttpRequest();
    req.open('GET', '/myfile.png', true);
    req.responseType = 'arraybuffer';

    req.onload = function(oEvent) {
      const arrayBuffer = req.response; // Note: not oReq.responseText
      expect(arrayBuffer).to.be.an('ArrayBuffer');
      done();
    };

    req.send(null);
  });
});
