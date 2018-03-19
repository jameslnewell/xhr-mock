import 'core-js';
import URLSearchParams = require('url-search-params');

if (!window.URLSearchParams) {
  window.URLSearchParams = URLSearchParams;
}
