module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Allow console.log for development
    'no-console': 'warn',
    // Prefer const over let
    'prefer-const': 'error',
    // No unused variables
    '@typescript-eslint/no-unused-vars': 'error',
    // No any type
    '@typescript-eslint/no-explicit-any': 'warn'
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.config.js',
    '*.config.cjs'
  ]
};