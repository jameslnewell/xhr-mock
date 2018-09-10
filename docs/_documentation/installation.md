---
title: Installation
position: 2
parameters:
  - name:
    content:
content_markdown: |-
  ##### With a Bundler

  If you are using a bundler like [Webpack](https://www.npmjs.com/package/webpack) or [Browserify](https://www.npmjs.com/package/browserify) install `xhr-mock` using `yarn` or `npm`:

  ```bash
  yarn add --dev xhr-mock
  ```

  Now import `xhr-mock` and start using it in your scripts:

  ```js
  import mock from 'xhr-mock';
  ```
  ##### Without a Bundler

  If you aren't using a bundler like [Webpack](https://www.npmjs.com/package/webpack) or [Browserify](https://www.npmjs.com/package/browserify) then add this script to your HTML:


  ```html
  <script src="https://unpkg.com/xhr-mock/dist/xhr-mock.js"></script>
  ```


  You can now start using the global, `XHRMock`, in your scripts!  

left_code_blocks:
  - code_block:
    title:
    language:

---
