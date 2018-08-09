---
title: Simulate timeout
position: 2.0
description:
parameters:
  - name:
    content:
  - name:
    content:
content_markdown: |-
  Returns a `Promise` that never resolves or rejects.

  A number of major libraries don't use the `timeout` event and use `setTimeout()` instead. Therefore, in order to mock timeouts in major libraries, we have to wait for the specified amount of time anyway.
  {: .info }

left_code_blocks:
  - code_block: |-
      import mock from 'xhr-mock';

      mock.setup();

      mock.get('/', () => new Promise(() => {}));

        const xhr = new XMLHttpRequest();
        xhr.timeout = 100;
        xhr.ontimeout = event => console.log('timeout');
        xhr.open('GET', '/');
        xhr.send();
    title: Simulate Timeout
    language: javascript  

---
