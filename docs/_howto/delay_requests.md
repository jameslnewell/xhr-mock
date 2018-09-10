---
title: Delay requests
position: 5.0
parameters:
  - name:
    content:
content_markdown: |-
  Requests can be delayed using our handy `delay` utility.
left_code_blocks:
  - code_block: |-
      import mock, {delay} from 'xhr-mock';

      mock.setup();

      // delays the request for three seconds.
      mock.post('/', delay({status: 201}, 3000));
    title: Delay Request
    language: javascript

---
