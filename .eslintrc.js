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
    'semi': [2, 'never'],
    'no-console': 'error',
    'no-debugger': 'error',
    'comma-dangle': ['error', 'never'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'vue/html-indent': ['error', 2],
    'vue/script-indent': ['error', 2],
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'padding-line-between-statements': ['error',
      { blankLine: 'always', prev: ['function', 'import'], next: ['class'] },
      { blankLine: 'never', prev: '*', next: ['const', 'let', 'var', 'return'] }
    ],
    'object-curly-spacing':  ['error', 'always'],
    'max-len': ['error', { 'code': 155 }],
    'require-await': 'error'
  }
}
