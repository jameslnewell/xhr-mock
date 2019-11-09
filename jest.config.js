module.exports = {
  projects: [
    {
      displayName: 'unit-tests',
      preset: '@jameslnewell/jest-preset-test',
      testMatch: ['<rootDir>/packages/*/(src|test)/**/*.test?(s).ts?(x)'],
      moduleNameMapper: {
        '^@xhr-mock/(.*)$': '<rootDir>/packages/$1/src',
      },
    },
  ],
};
