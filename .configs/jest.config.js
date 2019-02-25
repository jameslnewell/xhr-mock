module.exports = {
  rootDir: '..',
  preset: 'ts-jest',
  testMatch: ['<rootDir>/packages/router/src/**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsConfig: '.configs/tsconfig.tests.json'
    }
  }
};
