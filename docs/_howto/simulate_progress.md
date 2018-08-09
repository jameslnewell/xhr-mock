---
title: Simulate progress
position: 1.0
#type: get
description:
parameters:
  - name:
    content:
  - name:
    content:
content_markdown: |-
  Sets the `Content-Length` header and sends a body. `xhr-mock` will emit `ProgressEvent`s.

left_code_blocks:
  - code_block: |-
      import mock from 'xhr-mock';

      mock.setup();

      mock.post('/', {});

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = event => console.log(event.loaded, event.total);
      xhr.open('POST', '/');
      xhr.setRequestHeader('Content-Length', '12');
      xhr.send('Hello World!');
    title: Upload progress
    language: javascript
  - code_block: |-
      import mock from 'xhr-mock';

      mock.setup();

      mock.get('/', {
      headers: {'Content-Length': '12'},
      body: 'Hello World!'
      });

      const xhr = new XMLHttpRequest();
      xhr.onprogress = event => console.log(event.loaded, event.total);
      xhr.open('GET', '/');
      xhr.send();
    title: Download progress
    language: javascript
---
