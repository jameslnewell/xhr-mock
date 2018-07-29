---
title: XHR-Mock
position: 1.1
type:
description:
parameters:
  - name:
    content:
  - name:
    content:
content_markdown: |-
  Utility for mocking `XMLHttpRequest`


  | Command | Description |
  | --- | --- |
  | .setup() | Replace the global `XMLHttpRequest` object with the `MockXMLHttpRequest`. |
  | .teardown() | Restore the global `XMLHttpRequest` object to its original state. |
  | .reset() | Forget all the request handlers. |
  | .get(url \| regex, mock) | Register a factory function to create mock responses for each GET request to a specific URL. |
  | .post(url \| regex, mock) | Register a factory function to create mock responses for each POST request to a specific URL. |
  | .patch(url \| regex, mock) | Register a factory function to create mock responses for each PATCH request to a specific URL. |
  | .delete(url \| regex, mock) | Register a factory function to create mock responses for each DELETE request to a specific URL. |
  | .use(method, url \| regex, mock) | Register a factory function to create mock responses for each request to a specific URL. |
  | .use(fn) | Register a factory function to create mock responses for every request. |
  | .error(fn) | Log errors thrown by handlers. |


---
