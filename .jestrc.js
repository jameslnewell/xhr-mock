module.exports = {
  projects: [
    {
      displayName: 'lint',
      preset: '@jameslnewell/jest-preset-lint',
      cliOptions: {
        fix: true,
      },
    },
    {
      displayName: 'type',
      preset: '@jameslnewell/jest-preset-type',
    },
    {
      displayName: 'test',
      // preset: '@jameslnewell/jest-preset-test',
      preset: 'ts-jest',
      // moduleNameMapper: {
      //   "^@xhr-mock/(.*)$": "<rootDir>/packages/$1/src"
      // },
    },
  ],
};
