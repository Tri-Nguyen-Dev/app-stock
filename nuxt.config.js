import webpack from 'webpack'

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

  plugins: ['~/plugins/vuelidate.ts', '~/plugins/filters.ts'],

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
      'AutoComplete',
      'Card',
      'Sidebar',
      'InputNumber',
      'FileUpload',
      'Breadcrumb',
      'Toast',
      'Textarea',
      'Chart'
    ],
    directives: ['Tooltip', 'Badge']
  },

  axios: {
    proxy: process.env.NODE_ENV === 'development'
  },

  auth: {
    strategies: {
      local: false,
      keycloak: {
        scheme: 'oauth2',
        endpoints: {
          authorization: process.env.KEYCLOAK_API_URL +
                        '/realms/airtag/protocol/openid-connect/auth',
          token: process.env.KEYCLOAK_API_URL +
                        '/realms/airtag/protocol/openid-connect/token',
          userInfo: process.env.KEYCLOAK_API_URL +
                        '/realms/airtag/protocol/openid-connect/userinfo',
          logout: process.env.KEYCLOAK_API_URL +
                        '/realms/airtag/protocol/openid-connect/logout?redirect_uri=' +
                        encodeURIComponent(process.env.HOME_URL || '/')
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          name: 'Authorization',
          maxAge: 300
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        responseType: 'code',
        grantType: 'authorization_code',
        clientId: 'airtag-web',
        scope: ['openid', 'profile', 'email'],
        codeChallengeMethod: 'S256'
      }
    },
    plugins: ['~/plugins/auth.ts'],
    redirect: {
      login: '/',
      logout: '/login',
      home: '/stock'
    }
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
    plugins: [
      new webpack.ProvidePlugin({
        // global modules
        _: 'lodash'
      })
    ],
    babel: {
      compact: true,
      plugins: [
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
      ]
    }
  }
}