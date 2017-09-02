module.exports = {
  testRegex: '(src|test)/.*\\.test\\.ts$',
  transform: {
    '.(ts|tsx)': '<rootDir>/node_modules/ts-jest/preprocessor.js'
  },
  'moduleFileExtensions': [
    'ts', 'js', 'json'
  ]
}
