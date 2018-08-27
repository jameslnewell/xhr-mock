module.exports = {
  testURL: 'http://localhost/',
  testRegex: '(src|test)/.*\\.test\\.ts$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'json']
};
