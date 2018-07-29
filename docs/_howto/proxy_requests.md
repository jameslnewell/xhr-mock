---
title: Proxy requests
position: 4.0
parameters:
  - name:
    content:
content_markdown: |-
  If you want to mock some requests, but not all of them, you can proxy unhandled requests to a real server.
left_code_blocks:
  - code_block: |-
      import mock, {proxy} from 'xhr-mock';

      mock.setup();

      // mock specific requests
      mock.post('/', {status: 204});

      // proxy unhandled requests to the real servers
      mock.use(proxy);

      // this request will receive a mocked response
      const xhr1 = new XMLHttpRequest();
      xhr1.open('POST', '/');
      xhr1.send();

      // this request will receieve the real response
      const xhr2 = new XMLHttpRequest();
      xhr2.open('GET', 'https://jsonplaceholder.typicode.com/users/1');
      xhr2.send();
    title: Proxy Request
    language: javascript

---
