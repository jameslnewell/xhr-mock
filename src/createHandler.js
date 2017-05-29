/**
 * Mock a request
 * @param   {string}    [method]
 * @param   {string}    [url]
 * @param   {Function}  fn
 * @returns {Function}
 */
export default (method, url, fn) => {
  const matches = req => {
    const requestMethod = req.method();
    const requestURL = req.url().toString();

    if (requestMethod.toUpperCase() !== method.toUpperCase()) {
      return false;
    }

    if (url instanceof RegExp) {
      return url.test(requestURL);
    }

    return requestURL === url;
  };

  return (req, res) => {
    if (matches(req)) {
      return fn(req, res);
    } else {
      return false;
    }
  };
};
