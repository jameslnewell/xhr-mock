export function recordXHREventsAsync(xhr: XMLHttpRequest) {
  return new Promise(resolve => {
    const events = [];

    const addErrorEventListener = (type: string) => {
      xhr.addEventListener(type, () => {
        events.push(type);
        resolve(events);
      });
    };

    const addDownloadProgressEventListener = (type: string) => {
      xhr.addEventListener(type, (event: ProgressEvent) => {
        const {lengthComputable, loaded, total} = event;
        events.push([
          type,
          {
            lengthComputable,
            loaded,
            total
          }
        ]);
        if (type === 'loadend') {
          resolve(events);
        }
      });
    };

    const addUploadProgressEventListener = (type: string) => {
      xhr.upload.addEventListener(type, (event: ProgressEvent) => {
        const {lengthComputable, loaded, total} = event;
        events.push([
          `upload:${type}`,
          {
            lengthComputable,
            loaded,
            total
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

    xhr.addEventListener('readystatechange', () => {
      events.push(['readystatechange', xhr.readyState]);
    });
  });
}

export function recordXHREventsSync(xhr: XMLHttpRequest) {
  const events = [];

  const addErrorEventListener = (type: string) => {
    xhr.addEventListener(type, () => {
      events.push(type);
    });
  };

  const addDownloadProgressEventListener = (type: string) => {
    xhr.addEventListener(type, (event: ProgressEvent) => {
      const {lengthComputable, loaded, total} = event;
      events.push([
        type,
        {
          lengthComputable,
          loaded,
          total
        }
      ]);
    });
  };

  const addUploadProgressEventListener = (type: string) => {
    xhr.upload.addEventListener(type, (event: ProgressEvent) => {
      const {lengthComputable, loaded, total} = event;
      events.push([
        `upload:${type}`,
        {
          lengthComputable,
          loaded,
          total
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

  xhr.addEventListener('readystatechange', () => {
    events.push(['readystatechange', xhr.readyState]);
  });

  return events;
}
