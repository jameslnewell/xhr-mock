module.exports = {
  framework: 'mocha',
  reporter: 'dot',
  src_files: [
  ],
  serve_files: [
    './dist/tests.js'
  ]
  launch_in_ci: [
    'Firefox',
    'PhantomJS'
  ]
}