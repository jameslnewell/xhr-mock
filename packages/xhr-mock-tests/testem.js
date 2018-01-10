module.exports = {
  framework: 'mocha',
  reporter: 'dot',
  src_files: [
  ],
  serve_files: [
    './dist/tests.js'
  ],
  browser_args: {
    Chromium: [
      '--no-sandbox'
    ],
    Chrome: [
      '--no-sandbox'
    ]
  }
}