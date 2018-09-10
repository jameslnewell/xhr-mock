---
title: Example
position: 3
parameters:
  - name:
    content:
content_markdown: |-

  `./createUser.js` demonstrates a use case of [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).

   Axios, jQuery, Superagent or another package can also be used instead of the native XMLHttpRequest object.
   {: .info }



    2. A new XMLHttpRequest is created called `xhr`.
    3. the `.onreadystatechange` function is created for when the client receives the response from the server
    4. `xhr.open` initializes the request to the url.
    5. `xhr.setRequestHeader` sets the value of of the header, 'Content-Type' to JSON.
    6. `xhr.send` sends the request body to the server.


  `./createUser.test.js`, shows unit tests using `xhr-mock` which replaces `XMLHttpRequest` with `MockXMLHttpRequest`.

    1. `mock.post` registers the url and `POST` method to the request handler.  
    2. `createUser` method is called passing the parameter "John".
    3. `XHRMock` processes the request to the url, and:
        * If the value of the request header is in JSON,
        * If the request data is equal to "John",
    4. The response `"id": "abc-123"` is returned.


left_code_blocks:
  - code_block: |-
      // createUser serves as the client.
      export default function createUser(reqdata) {
        return new Promise((resolve, reject) => {
          // we create a new XMLHttpRequest object.
          const xhr = new XMLHttpRequest();
          // the onreadystatechange function is for receiving the response and checking the status.
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
          // initializes the request to the url using the POST method, sets the request header value in JSON, and sends the request.
          xhr.open('post', '/api/user');
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify({data: reqdata}));
        });
      }
    title: ./createUser.js
    language: javascript
  - code_block: |-
      // Tests the code with the mock request and response.
      import mock from 'xhr-mock';
      import createUser from './createUser';

      describe('createUser()', () => {
        // replaces the real XHR object with the mock XHR object before each test.
        beforeEach(() => mock.setup());

        // puts the real XHR object back and clears the mock after each test.
        afterEach(() => mock.teardown());

        it('should send the data as JSON', async () => {
          expect.assertions(2);
          // mock sets up the request function and registers the request from the client (createUser) to the request handler. If the request header is in JSON, and the request body is equal to "John," the response is returned: "id":"abc-123".
          mock.post('/api/user', (req, res) => {
            expect(req.header('Content-Type')).toEqual('application/json');
            expect(req.body()).toEqual('{"data":{"name":"John"}}');
            return res.status(201).body('{"data":{"id":"abc-123"}}');
          });
          // makes the requests as the client.
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
