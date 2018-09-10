---
title: One-off requests
position: 6.0
parameters:
  - name:
    content:
content_markdown: |-
  Requests can be made on one off occasions using our handy `once` utility.

left_code_blocks:
  - code_block: |-
      import mock, {once} from 'xhr-mock';

      mock.setup();

      // the response will only be returned the first time a request is made.
      mock.post('/', once({status: 201}));
    title: One-off Request
    language: javascript
---
