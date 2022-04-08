export default {
  ssr: false,

  target: 'static',

  head: {
    title: 'AirTag Management System',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    // custom links here
    link: []
  },

  plugins: ['~/plugins/vuelidate.ts', '~/plugins/toast.ts'],

  components: true,

  buildModules: ['@nuxt/typescript-build'],

  modules: [
    'primevue/nuxt',
    'cookie-universal-nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources',

    ['@nuxtjs/google-fonts', {
      families: {
        'Google+Sans': {
          wght: [300, 400, 500, 700, 900]
        }
      },
      display: 'swap'
    }]
  ],
  // PrimeVue Config
  primevue: {
    theme: 'bootstrap4-light-blue',
    ripple: true,
    components: [
      'InputText',
      'Button',
      'Checkbox',
      'DataTable',
      'Dialog',
      'Tag',
      'Calendar',
      'Tooltip',
      'TabPanel',
      'TabView',
      'Column',
      'ColumnGroup',
      'DropDown',
      'ScrollPanel',
      'MultiSelect',
      'Paginator',
      'ConfirmDialog',
      'Toast',
      'ScrollPanel',
      'TieredMenu',
      'AutoComplete'
    ],
    directives: ['Tooltip', 'Badge']
  },

  axios: {
    proxy: process.env.NODE_ENV === 'development'
  },

  auth: {
    rewriteRedirects: true,
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          required: false
        },
        user: {
          property: '',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' }
        }
      }
    },
    plugins: ['~/plugins/auth.ts']
  },

  styleResources: {
    sass: ['@/assets/styles/main.sass'],
    hoistUseStatements: true
  },

  proxy: {
    '/api/': {
      target: process.env.BE_API_URL,
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
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
      ]
    }
  }
};
