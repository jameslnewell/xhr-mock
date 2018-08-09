---
title: MockXMLHttpRequest
position: 1.2
type:
description: Replaces `XMLHttpRequest` object.
parameters:
  - name:
    content:
content_markdown: |-
  Refer to `xhr-mock.setup()` and `xhr-mock.teardown()` in the `xhr-mock` table.

  #### MockRequest
  The following methods make requests to the mock server:

  ##### .method() : *requestMethod*
    * __description:__
      * Gets the request method.
    * __return:__
      * method: returns method as a string in the form of `DELETE`, `GET`, `HEAD`, `OPTIONS`, `POST`, or `PUT`.  


  ##### .url() : *MockURL*
  <!--MockURL contains url related data such as port and host. See source code for details.  -->
    * __description:__
      * Gets the request MockURL object.
    * __return:__
      * MockURL object

  ##### .header( *name* , *value* )
    * __description:__
      * Sets the request header's name and value.
    * __parameters:__
      * name : string
      * value: string


  ##### .header( *name* ) : *value*
    * __description:__
      * Gets a request header and returns the value as a string, or `null` if no header has been set.
    * __parameters:__
      * name: string
    * __return:__
      * value: string or `null`

  ##### .headers() : *requestHeaders*  <!--is it an object array? -->
    * __description:__
      * Gets the request headers and returns the value as an object.
    * __return:__
      * headers: object

  ##### .headers( *requestHeaders* ) <!--is it an object array? -->
    * __description:__
      * Sets the request headers.
    * __parameters:__
      * headers: object


  ##### .body() : *requestBody*
    * __description:__
      * Gets the request body.
    * __return:__
      * body: string

  ##### .body( *requestBody* )
    * __description:__
      * Sets the request body.
    * __parameters:__
      * body: string  

  #### MockResponse
  The following methods get the responses to the mock server:

  ##### .status() : *value*
    * __description:__
      * Gets the response status.
    * __return:__
      * value: number  

  ##### .status( *code* )
    * __description:__
      * Sets the response status.
    * __parameters:__
      * code: number  

  ##### .reason() : *responseReason*
    * __description:__
      * Gets the response reason.
    * __return:__
      * reason: string

  ##### .reason( *phrase* )
    * __description:__
      * Set the response reason.
    * __parameters:__
      * phrase: string  

  ##### .header( *name* , *value* )
    * __description:__
      * Sets a response header.
    * __parameters:__
      * name: string
      * value: string

  ##### .header( *name* ) : *value*
    * __description:__
      * Gets a response header and returns the value as a string or `null`
    * __parameters:__
      * name: string
    * __return:__
      * value: string or `null`

  ##### .headers() : *responseHeaders*    <!--is it an object array?  -->
    * __description:__
      * Get the response headers.
    * __return:__
      * headers: object

  ##### .headers( *responseHeaders* )     <!--is it an object array?  -->
    * __description:__
      * Set the response headers.
    * __parameters:__
      * headers: object

  ##### .body() : *responseBody*
    * __description:__
      * Get the response body.
    * __return:__
      * body: string

  ##### .body( *ResponseBody* )
    * __description:__
      * Set the response body.
    * __parameters:__
      * body: string


---
