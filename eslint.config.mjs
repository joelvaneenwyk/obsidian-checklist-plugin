/** @type {import('eslint-plugin-import').Linter['rules']} */
export default [
  {
    files: ['src/**/*.js'],
    ignores: ['main.js'],
    rules: {
      semi: 'error',
    },
  },
]
