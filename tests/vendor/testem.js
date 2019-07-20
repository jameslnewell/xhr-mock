module.exports = {
  framework: 'mocha',
  reporter: 'dot',
  src_files: [],
  serve_files: ['./dist/index.js', './dist/index.js.map'],
  browser_args: {
    Chromium: ['--no-sandbox'],
    Chrome: ['--no-sandbox']
  }
};
