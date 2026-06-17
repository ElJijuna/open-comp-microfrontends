import eslintReactTsxConfig from 'super-configs/eslint/react/tsx';

export default [
  ...eslintReactTsxConfig,
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
];
