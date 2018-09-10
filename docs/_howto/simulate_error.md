---
title: Simulate error
position: 3.0
description:
parameters:
  - name:
    content:
  - name:
    content:
content_markdown: |-
  Returns a `Promise` that rejects. If you want to test a particular error you use one of the pre-defined error classes.

left_code_blocks:
  - code_block: |-
      import mock from 'xhr-mock';

      mock.setup();

      mock.get('/', () => Promise.reject(new Error()));

      const xhr = new XMLHttpRequest();
      xhr.onerror = event => console.log('error');
      xhr.open('GET', '/');
      xhr.send();
    title: Simulate Error
    language: javascript

---
