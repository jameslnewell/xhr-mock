module.exports = {
  extends: '@jameslnewell/eslint-config',
  parserOptions: {
    project: './tsconfig.json',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 0,
      },
    },
  ],
};
