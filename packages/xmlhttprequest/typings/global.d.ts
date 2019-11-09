import MockXMLHttpRequest from '@xhr-mock/xmlhttprequest';

declare module 'global' {
  export let XMLHttpRequest: typeof MockXMLHttpRequest;
}
