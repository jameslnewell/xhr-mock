import XHRMock from './XHRMock';
import MockRequest from './MockRequest';
import MockResponse from './MockResponse';
import proxy from './proxy';
import {once} from './utils/once';
import {delay} from './utils/delay';
import {sequence} from './utils/sequence';

export default XHRMock;
export {MockRequest, MockResponse, proxy, once, delay, sequence};
