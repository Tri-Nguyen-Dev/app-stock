import { Plugin } from '@nuxt/types'
import axios from 'axios'
import { ToastServiceMethods } from 'primevue/toastservice'
import { ErrorResponse, initializeAxios } from '~/utils'

declare module 'vue/types/vue' {
  interface Vue {
    $toast: ToastServiceMethods
  }
}
const auth: Plugin = ({ app, $auth, store }) => {
  const axiosInstance = axios.create()

  axiosInstance.interceptors.request.use((config) => {
    const token = app.$cookies.get('auth._token.keycloak')
    if ($auth.loggedIn && token) {
      config.headers.Authorization = token
    }
    if (process.env.NODE_ENV !== 'development') {
      config.baseURL = process.env.BE_API_URL
    } else {
      config.url = '/api' + config.url
    }
    return config
  }, (error) => {
    store.commit('commons/store-common/setViewLoading', false)
    return Promise.reject(error)
  })

  axiosInstance.interceptors.response.use((response) => {
    store.commit('commons/store-common/setViewLoading', false)
    return response
  }, (error) => {
    const errorResponse: ErrorResponse = error.response.data
    if (errorResponse) {
      store.commit('commons/store-error/setError', errorResponse)
    }
    store.commit('commons/store-common/setViewLoading', false)
    return Promise.reject(error)
  })

  initializeAxios(axiosInstance)
}

export default auth
