---
title: XHRMock
position: 1.1
type:
description:
parameters:
  - name:
    content:
  - name:
    content:
content_markdown: |-
  <!-- Utility for mocking XMLHttpRequest -->
  Methods used to mock the `XMLHttpRequest` object:  

  ##### .setup()
    * __description:__
      * Replaces the global XMLHttpRequest object with the MockXMLHttpRequest.

  ##### .teardown()
    * __description:__
      * Restores the global `XMLHttpRequest` object to its original state.

  ##### .reset()
    * __description:__
      * Forgets all the request handlers.

  ##### .get( *url* \| *regex* , *mock* )
    * __description:__
      * Registers mock as a factory function by passing it as a parameter
        to the .get function. When XHRMock receives GET request, it then uses the registered mock function to process the request. If the request is as expected, the mock returns a response. For greater detail, look at the source code.
    * __parameters__:
      * the url is passed into the function as either a string or a `RegExp` object.
      * mock is a factory function, `MockFunction`, passed into the .get function as a parameter.

  ##### .post( *url* \| *regex* , *mock* )
    * __description:__
      * Registers mock as a factory function by passing it as a parameter
      to the .post function. When XHRMock receives POST request, it then uses the registered mock function to process the request. If the request is as expected, the mock returns a response. For greater detail, look at the source code.
    * __parameters__:
      * the url is passed into the function as either a string or a `RegExp` object.
      * mock is a factory function, `MockFunction`, passed into the .post function as a parameter.

  ##### .patch( *url* \| *regex* , *mock* )
    * __description:__
      * Registers mock as a factory function by passing it as a parameter
        to the .patch function. When XHRMock receives PATCH request, it then uses the registered mock function to process the request. If the request is as expected, the mock returns a response. For greater detail, look at the source code.
    * __parameters__:
      * the url is passed into the function as either a string or in regex as an object.
      * mock is a factory function, `MockFunction`, passed into the .patch function as a parameter.

  ##### .delete( *url* \| *regex* , *mock* )
    * __description:__
      * Registers mock as a factory function by passing it as a parameter
      to the .delete function. When XHRMock receives DELETE request, it then uses the registered mock function to process the request. If the request is as expected, the mock returns a response. For greater detail, look at the source code.
    * __parameters__:
      * the url is passed into the function as either a string or in regex as an object.
      * mock is a factory function, `MockFunction`, passed into the .delete function as a parameter.

  ##### .use( *method* , *url* \| *regex* , *mock* )
    * __description:__
      * The .use function includes a method. .use registers mock as a factory function by passing it as a parameter
      to the .use function. When XHRMock receives USE request, it then uses the registered mock function to process the request. If the request is as expected, the mock returns a response. For greater detail, look at the source code.
    * __parameters__:
      * the method is passed as a string.
      * the url is passed into the function as either a string or in regex as an object.
      * mock is a factory function, `MockFunction`, passed into the .use function as a parameter.

  ##### .use( *mock* )
    * __description:__
      * Registers mock as a factory function to create mock responses for every request that passes through it. Url or method is not distinguished.
    * __parameters__:
      * mock is a factory function, `MockFunction`, passed into the .use function as a parameter.

  ##### .error( *fn* )
    * __description:__
      * Logs errors thrown by handlers.
    * __parameters__:
      * function

---
