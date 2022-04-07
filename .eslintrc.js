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
    quotes: ['error', 'single']
  }
}
