---
title: MockResponse
position: 1.3
type:
description:
parameters:
  - name:
    content:
  - name:
    content:
content_markdown: |-

  The following methods get the responses to the mock server:

  | Command | Description |
  | --- | --- |
  | .status() : number | Get the response status. |
  | .status(code : number) | Set the response status. |
  | .reason() : string | Get the response reason. |
  | .reason(phrase : string) | Set the response reason. |
  | .header(name : string, value: string) | Set a response header. |
  | .header(name : string) : string | null \| Get a response header. |
  | .headers() : object | Get the response headers. |
  | .headers(headers : object) | Set the response headers. |
  | .body() : string | Get the response body. |
  | .body(body : string) | Set the response body. |

---
