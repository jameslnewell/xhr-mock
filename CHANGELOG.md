# Change log

## 2.0.0-preview.5

- added an export for the real `XMLHttpRequest` object
- fix: made `MockObject` props optional
- break: changed the signature of the `URL` returned from `MockRequest.url()`

## 2.0.0-preview.4

- fix: fixed a bug with upload progress

## 2.0.0-preview.3

- fix: include transpiled files in published package

## 2.0.0-preview.2

- added types
- added support for mock objects
- break: changed the ordering of `MockRequest.progress()` and `MockRequest.progress()`

## 2.0.0-preview.1

- added support for upload progress
- break: renamed `MockResponse.statusText()` to `MockResponse.reason()`
- break: removed `MockRequest.query()` and changed `MockRequest.url()` to return a URL object (with a `.toString()` method)
- break: removed `MockResponse.timeout()` - instead, return a promise that never resolves
- break: moved `MockRequest.progress()` to `MockResponse.progress()` and added `MockRequest.progress()`
- break: removed support for [`component`](https://github.com/componentjs/component)

## 1.9.1

- fixed [#30](https://github.com/jameslnewell/xhr-mock/issues/30)

## 1.9.0

- added `Response.statusText()` for setting the status text

## 1.8.0

- added support for regexes instead of URLs in all the mock methods
- added the `.query()` method to the request object
- added the `.reset()` method to `mock` and `MockXMLHttpRequest`
- added `withCredentials` to the mocked XHR objects (used by some libraries to test for "real" XHR support)

## 1.7.0

- added support for `addEventListener` ([#15](https://github.com/jameslnewell/xhr-mock/pull/15))
