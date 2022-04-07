module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'prettier'
  ],
  plugins: ['prettier'],
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'comma-dangle': ['error', 'never'],
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'padding-line-between-statements': ['error',
      { blankLine: 'always', prev: ['function', 'import'], next: ['class'] },
      { blankLine: 'never', prev: '*', next: ['const', 'let', 'var', 'return'] }
    ],
    quotes: ['error', 'single']
  }
}
