module.exports = {
  projects: [
    {
      displayName: 'lint',
      preset: '@jameslnewell/jest-preset-lint',
    },
    {
      displayName: 'type',
      preset: '@jameslnewell/jest-preset-type',
    },
    {
      displayName: 'unit tests',
      preset: '@jameslnewell/jest-preset-test',
      testMatch: ['<rootDir>/packages/*/(src|test)/**/*.test.ts?(x)'],
      moduleNameMapper: {
        '^@xhr-mock/(.*)$': '<rootDir>/packages/$1/src',
      },
    },
    // {
    //   displayName: 'integration tests',
    //   preset: '@jameslnewell/jest-preset-test',
    //   moduleNameMapper: {
    //     "^@xhr-mock/(.*)$": "<rootDir>/packages/$1/src"
    //   },
    // },
  ],
};
