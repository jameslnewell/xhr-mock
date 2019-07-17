import {Request, Response} from '@xhr-mock/router';

export function calculateProgress(message: Request | Response) {
  const header = message.headers['content-length'];
  const body = message.body;

  let lengthComputable = false;
  let total = 0;

  if (header) {
    const contentLength = parseInt(header, 10);
    if (!isNaN(contentLength)) {
      lengthComputable = true;
      total = contentLength;
    }
  }

  return {
    lengthComputable,
    loaded: (body && body.length) || 0, //FIXME: Measure bytes not (unicode) chars
    total,
  };
}
