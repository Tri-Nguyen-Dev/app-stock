import { Plugin } from '@nuxt/types'
import axios from 'axios'
import { ErrorResponse, initializeAxios } from '~/utils'

declare module 'vue/types/vue' {
  interface Vue {
    $bvToast: {
      toast(message: string, options: any): void
    }
    $bvModal: {
      show(id: string): void
      hide(id: string): void
    }
  }
}
const auth: Plugin = ({ $auth, store }) => {
  const axiosInstance = axios.create()
  axiosInstance.interceptors.request.use((config) => {
    if ($auth.loggedIn) {
      config.headers.Authorization = `Bearer ${store.state.commons['store-token'].token.token}`
    }
    if (process.env.NODE_ENV !== 'development') {
      config.baseURL = process.env.BE_API_URL
    } else {
      config.url = '/api' + config.url
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  axiosInstance.interceptors.response.use((response) => {
    return response
  }, (error) => {
    const errorResponse: ErrorResponse = error.response.data
    if (errorResponse) {
      store.commit('commons/store-error/setError', errorResponse)
    }
    return Promise.reject(error)
  })

  initializeAxios(axiosInstance)
}
export default auth
