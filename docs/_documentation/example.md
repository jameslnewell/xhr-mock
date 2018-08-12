---
title: Example
position: 3
parameters:
  - name:
    content:
content_markdown: |-

  <!-- Study the following example codes:
  The first is a piece of code that uses `XMLHttpRequest`.
  The second piece of code tests the first using xhr-mock. -->

  `./createUser.js` demonstrates a use case of `XMLHttpRequest`.

   We could have just as easily use Axios, jQuery, Superagent or another package here instead of using the native XMLHttpRequest object)
   {: .info }

    + `xhr.open` opens the request.
    + `xhr.setRequestHeader` sets the RequestHeader in JSON.
    + `xhr.send` sends the data request.


  `./createUser.test.js`, shows unit tests using `xhr-mock` which replaces `XMLHttpRequest` with `MockXMLHttpRequest`.

  <!--Registers mock as a factory function by passing it as a parameter to the .post function. When XHRMock receives POST request, it then uses the registered mock function to process the request. If the request is as expected, the mock returns a response. For greater detail, look at the source code.-->

  + `mock.setup` replaces the real XHR object with the mock XHR object before each test.
  + `mock.post` registers the url to the request handler. (?POST method)
  + `createUser` method is called passing the parameter "John"
  + `XHRMock` processes the request to the url (?POST method)
    * If the request header is in JSON
    * If the request data is equal to "John"
  + the response `id: "abc-123"` is returned.

  <!-- If the RequestHeader in JSON and the requested data to equal "John". If these are both true, the id "abc-123" is retuned. -->

left_code_blocks:
  - code_block: |-
      export default function createUser(reqdata) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
              if (xhr.status === 201) {
                try {
                  resolve(JSON.parse(xhr.responseText).data);
                } catch (error) {
                  reject(error);
                }
              } else if (xhr.status) {
                try {
                  reject(JSON.parse(xhr.responseText).error);
                } catch (error) {
                  reject(error);
                }
              } else {
                eject(new Error('An error ocurred whilst sending the request.'));
              }
            }
          };
          xhr.open('post', '/api/user');
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify({data: reqdata}));
        });
      }
    title: ./createUser.js
    language: javascript
  - code_block: |-
      // Now lets test the code we've written...
      import mock from 'xhr-mock';
      import createUser from './createUser';

      describe('createUser()', () => {
        // replace the real XHR object with the mock XHR object before each test
        beforeEach(() => mock.setup());

        // put the real XHR object back and clear the mocks after each test
        afterEach(() => mock.teardown());

        it('should send the data as JSON', async () => {
          expect.assertions(2);
          // set up: accept request for John, response abc-123
          mock.post('/api/user', (req, res) => {
            expect(req.header('Content-Type')).toEqual('application/json');
            expect(req.body()).toEqual('{"data":{"name":"John"}}');
            return res.status(201).body('{"data":{"id":"abc-123"}}');
          });
          // request John
          await createUser({name: 'John'});
        });

        it('should resolve with some data when status=201', async () => {
          expect.assertions(1);

          mock.post('/api/user', {
            status: 201,
            reason: 'Created',
            body: '{"data":{"id":"abc-123"}}'
          });

          const user = await createUser({name: 'John'});

          expect(user).toEqual({id: 'abc-123'});
        });

        it('should reject with an error when status=400', async () => {
          expect.assertions(1);

          mock.post('/api/user', {
            status: 400,
            reason: 'Bad request',
            body: '{"error":"A user named \\"John\\" already exists."}'
          });

          try {
            const user = await createUser({name: 'John'});
          } catch (error) {
            expect(error).toMatch('A user named "John" already exists.');
          }
        });
      });
    title: ./createUser.test.js
    language: javascript
---
