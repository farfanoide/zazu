module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard',
    'prettier/unicorn',
    'plugin:import/errors',
    'plugin:import/warnings',
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
  plugins: ['react', 'html', 'babel', 'flowtype', 'react', 'unicorn', 'import'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: '16.13.1',
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
