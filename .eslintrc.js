module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.eslint.json'],
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'prettier',
    'prettier/react',
    'prettier/standard',
    'prettier/unicorn',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    'comma-dangle': [2, 'always-multiline'],
    'unicorn/filename-case': [
      'error',
      {
        case: 'camelCase',
      },
    ],
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'react', 'html', 'babel', 'react', 'unicorn', 'import'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: '16.13.1',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  globals: {
    newrelic: true,
    __nr_require: true,
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    node: true,
  },
}
