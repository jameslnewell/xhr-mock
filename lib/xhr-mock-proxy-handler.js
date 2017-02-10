var window              = require('global');
var Promise             = require('lie');
var realXMLHttpRequest  = window.XMLHttpRequest;

function parseXhrHeaders(xhr) {
    var headers = {};
    var rawHeaders = xhr.getAllResponseHeaders().split('\r\n');

    for (var i = 0; i < rawHeaders.length; i++) {
        var rawHeader = rawHeaders[i].trim();
                
        if (rawHeader !== '') {
            var splittedHeader = rawHeader.split(": ");
            var headerName = splittedHeader[0];
            var headerValue = splittedHeader[1];
            headers[headerName] = headerValue;
        }
    }

    return headers;
}

module.exports = function(req, res) {
    return new Promise(function(resolve, reject) {
        var xhr = new realXMLHttpRequest();
        xhr.open(req.method(), req.url());

        var headers = req.headers();
        for (var name in headers) {
            if (headers.hasOwnProperty(name)) {
                xhr.setRequestHeader(name, headers[name]);
            }
        }

        xhr.onload = function() {
            resolve(xhr);
        }

        xhr.onerror = function(err) {
            reject(err);
        }

        xhr.send(req.body());
    }).then(function (xhr) {
        return res
            .status(xhr.status)
            .headers(parseXhrHeaders(xhr))
            .body(xhr.response);
    });
};
