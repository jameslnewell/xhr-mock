module.exports = {
  rootDir: '..',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/packages/*/src/**/*.test.ts'],
  modulePathIgnorePatterns: ['proxy'],
  globals: {
    'ts-jest': {
      tsConfig: '.configs/tsconfig.tests.json',
      diagnostics: false
    }
  }
};
