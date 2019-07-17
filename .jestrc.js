module.exports = {
  projects: [
    {
      displayName: 'lint',
      preset: '@jameslnewell/jest-preset-lint',
      testMatch: ['<rootDir>/**/(src|test)/**/*.test.ts?(x)'],
    },
    {
      displayName: 'type',
      preset: '@jameslnewell/jest-preset-type',
      testMatch: ['<rootDir>/**/(src|test)/**/*.test.ts?(x)'],
    },
    {
      displayName: 'test',
      preset: '@jameslnewell/jest-preset-test',
      testMatch: ['<rootDir>/**/(src|test)/**/*.test.ts?(x)'],
    },
  ],
};
