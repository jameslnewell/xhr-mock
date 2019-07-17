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
      displayName: 'test',
      preset: '@jameslnewell/jest-preset-test',
      // moduleNameMapper: {
      //   "^@xhr-mock/(.*)$": "<rootDir>/packages/$1/src"
      // },
    },
  ],
};
