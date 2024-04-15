import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import functionalPlugin from 'eslint-plugin-functional'
import importPlugin from 'eslint-plugin-import' // 'import' is ambiguous & prettier has trouble
import {Linter} from 'eslint'

/** @type {Linter['rules']} */
export default [
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {modules: true},
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
    plugins: {
      functional: functionalPlugin,
      import: importPlugin,
      '@typescript-eslint': typescriptPlugin,
      ts: typescriptPlugin,
    },
    files: ['src/**/*.ts'],
    rules: {
      ...typescriptPlugin.configs['eslint-recommended'].rules,
      ...typescriptPlugin.configs['recommended'].rules,
      semi: 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/ban-ts-comment': 0,
    },
  },
]
