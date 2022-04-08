module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/recommended',
    'plugin:nuxt/recommended',
    'prettier'
  ],
  plugins: ['prettier'],
  rules: {
    // 'semi': [1, 'always'],
    'no-console': 'error',
    'no-debugger': 'error',
    'comma-dangle': ['error', 'never'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'vue/html-indent': ['error', 2],
    'vue/script-indent': ['error', 2]
  }
};
