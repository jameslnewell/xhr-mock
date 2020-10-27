import {expect} from 'chai';
import {ajax} from 'rxjs/ajax';
import mock from 'xhr-mock';

describe('rxjs', () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());

  it('should return a JSON object', (done) => {
    mock.post('/some-url', {
      body: JSON.stringify({data: 'mockdata'}),
    });

    ajax({
      url: '/some-url',
      body: {some: 'something'},
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    }).subscribe({
      next: (response) => {
        try {
          expect(response.response).to.be.deep.equal({
            data: 'mockdata',
          });
        } catch (error) {
          done(error);
        }
      },
      error: (error) => done(error),
      complete: () => done(),
    });
  });
});
