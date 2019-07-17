import {MockXMLHttpRequestEventTarget} from './MockXMLHttpRequestEventTarget';

// @ts-ignore: https://github.com/jameslnewell/xhr-mock/issues/45
export class MockXMLHttpRequestUpload extends MockXMLHttpRequestEventTarget
  implements XMLHttpRequestUpload {}
