# Change log

# 2.5.1

- fix: resolve import and local declaration name conflict to support Typescript@3.7 ([#92](https://github.com/jameslnewell/xhr-mock/pull/92)) ([more info](https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/#local-and-imported-type-declarations-now-conflict))

# 2.5.0

- added the `sequence()` utility function ([#83](https://github.com/jameslnewell/xhr-mock/pull/83))

# 2.4.1

- fix: check for DOM specific classes before checking for an instance of them so that environments without them e.g. `mocha` without `jsdom` mostly works

# 2.4.0

- added `once` and `delay` utility functions.
- changed the signature of `MockURL.query` from `{}` to `{[name: string]: string}`

# 2.3.2

- fix: proxy all response bodies, not just text ([#62](https://github.com/jameslnewell/xhr-mock/issues/62))

# 2.3.1

- fix: format the default error message better ([#57](https://github.com/jameslnewell/xhr-mock/issues/57#issuecomment-376489889))
- fix: IE11 which chokes on `URLSearchParams` ([#58](https://github.com/jameslnewell/xhr-mock/pull/58))

# 2.3.0

- added support for requests with `Blob`, `FormData` or `URLSearchParams` bodies
- log errors thrown/rejected in handlers by default but allow logging to be customised

# 2.2.0

- added "support" for `responseType` of `arraybuffer`, `blob` and `document` by returning whatever object `res.body(body)` is set to

## 2.1.0

- added support for `responseType="json"`

## 2.0.4

- fix: improve compliance of `.response`

## 2.0.3

- improving the documentation

## 2.0.2

- fix: version badge on `README.md`

## 2.0.1

- fix: undefined `__generator` in UMD bundle due to [#85](https://github.com/rollup/rollup-plugin-typescript/issues/85)

## 2.0.0

- released with updated docs

## 2.0.0-preivew.15

- fix (potential break): when `async=false` `loadstart` and `progress` events are no longer emitted according to the spec
- fix (potential break): on `error`, `timeout` and `abort` the correct sequence of events are fired ([#41](https://github.com/jameslnewell/xhr-mock/issues/41))
- fix (potential break): changed the `error` and `onabort` to be `ProgressEvent`s like the latest spec ([and different to the typescript types](https://github.com/Microsoft/TypeScript/issues/19830))

## 2.0.0-preivew.14

- fix: made the proxy work in NodeJS

## 2.0.0-preivew.13

- fix: examples in `README.md`

## 2.0.0-preivew.12

- added a non-minified UMD bundle - `./dist/xhr-mock.js`

## 2.0.0-preivew.11

- added `proxy` - a handler for proxying requests as real XHR
- added `XHRMock.RealXMLHttpRequest`
- deprecated `XHRMock.mock()` in favor of `XHRMock.use()`
- removed `debugger` statements and added linting
- fix: made `MockXMLHttpRequest` implement `XMLHttpRequest` and missing enum values on the instance e.g. `DONE`

## 2.0.0-preview.10

- fixed a bug where the `body` would not be sent when it was an empty string ([#32](https://github.com/jameslnewell/xhr-mock/issues/32))

## 2.0.0-preview.9

- added support for `RegExp` in typings ([#36](https://github.com/jameslnewell/xhr-mock/pull/36))

## 2.0.0-preview.8

- added `typings` to `package.json`

## 2.0.0-preview.6

- break: removed `MockRequest.progress()` and `MockResponse.progress()`

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
