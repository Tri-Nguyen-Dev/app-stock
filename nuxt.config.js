export default {
  ssr: false,

  target: 'static',

  head: {
    title: 'Airtag CRM',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      {
        href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro',
        rel: 'stylesheet',
        type: 'text/css'
      }
    ]
  },

  css: [
    '@/assets/main.sass'
  ],

  plugins: [
    '~/plugins/vuelidate.ts'
  ],

  components: true,

  buildModules: [
    '@nuxt/typescript-build'
  ],

  modules: [
    'bootstrap-vue/nuxt',
    'cookie-universal-nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources'
  ],

  bootstrapVue: {
    icons: true
  },

  axios: {
    proxy: process.env.NODE_ENV === 'development'
  },

  auth: {
    // Options
  },

  styleResources: {
    sass: ['./assets/**.sass']
  },

  proxy: {
    '/api/': {
      target: 'http://localhost:3000',
      pathRewrite: { '^/api/': '' },
      changeOrigin: true
    }
  },

  server: {
    port: process.env.SERVER_PORT
  },

  build: {
    babel: {
      compact: true,
      plugins: [
        ['@babel/plugin-proposal-private-property-in-object', { 'loose': true }]
      ]
    }
  }
}
