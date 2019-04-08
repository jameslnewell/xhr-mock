'use strict';
exports.__esModule = true;
function recordXHREventsAsync(xhr) {
  return new Promise(function(resolve) {
    var events = [];
    var addErrorEventListener = function(type) {
      xhr.addEventListener(type, function() {
        events.push(type);
        resolve(events);
      });
    };
    var addDownloadProgressEventListener = function(type) {
      xhr.addEventListener(type, function(event) {
        var lengthComputable = event.lengthComputable,
          loaded = event.loaded,
          total = event.total;
        events.push([
          type,
          {
            lengthComputable: lengthComputable,
            loaded: loaded,
            total: total
          }
        ]);
        if (type === 'loadend') {
          resolve(events);
        }
      });
    };
    var addUploadProgressEventListener = function(type) {
      xhr.upload.addEventListener(type, function(event) {
        var lengthComputable = event.lengthComputable,
          loaded = event.loaded,
          total = event.total;
        events.push([
          'upload:' + type,
          {
            lengthComputable: lengthComputable,
            loaded: loaded,
            total: total
          }
        ]);
      });
    };
    addErrorEventListener('abort');
    addErrorEventListener('error');
    addErrorEventListener('timeout');
    addDownloadProgressEventListener('loadstart');
    addDownloadProgressEventListener('progress');
    addDownloadProgressEventListener('load');
    addDownloadProgressEventListener('loadend');
    addUploadProgressEventListener('loadstart');
    addUploadProgressEventListener('progress');
    addUploadProgressEventListener('load');
    addUploadProgressEventListener('loadend');
    xhr.addEventListener('readystatechange', function() {
      events.push(['readystatechange', xhr.readyState]);
    });
  });
}
exports.recordXHREventsAsync = recordXHREventsAsync;
function recordXHREventsSync(xhr) {
  var events = [];
  var addErrorEventListener = function(type) {
    xhr.addEventListener(type, function() {
      events.push(type);
    });
  };
  var addDownloadProgressEventListener = function(type) {
    xhr.addEventListener(type, function(event) {
      var lengthComputable = event.lengthComputable,
        loaded = event.loaded,
        total = event.total;
      events.push([
        type,
        {
          lengthComputable: lengthComputable,
          loaded: loaded,
          total: total
        }
      ]);
    });
  };
  var addUploadProgressEventListener = function(type) {
    xhr.upload.addEventListener(type, function(event) {
      var lengthComputable = event.lengthComputable,
        loaded = event.loaded,
        total = event.total;
      events.push([
        'upload:' + type,
        {
          lengthComputable: lengthComputable,
          loaded: loaded,
          total: total
        }
      ]);
    });
  };
  addErrorEventListener('abort');
  addErrorEventListener('error');
  addErrorEventListener('timeout');
  addDownloadProgressEventListener('loadstart');
  addDownloadProgressEventListener('progress');
  addDownloadProgressEventListener('load');
  addDownloadProgressEventListener('loadend');
  addUploadProgressEventListener('loadstart');
  addUploadProgressEventListener('progress');
  addUploadProgressEventListener('load');
  addUploadProgressEventListener('loadend');
  xhr.addEventListener('readystatechange', function() {
    events.push(['readystatechange', xhr.readyState]);
  });
  return events;
}
exports.recordXHREventsSync = recordXHREventsSync;
