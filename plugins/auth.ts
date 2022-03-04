import { Plugin } from '@nuxt/types'
import axios from 'axios'
import { ErrorResponse, initializeAxios, SuccessResponse } from '~/utils'
import { Token } from '~/store/commons'

declare module 'axios' {
  export interface AxiosRequestConfig {
    showLoader?: boolean
  }
}

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

const auth: Plugin = async ({ $auth, store, $axios, app }) => {
  const axiosInstance = axios.create()

  axiosInstance.defaults.showLoader = true

  if ($auth.loggedIn) {
    const url = `${process.env.NODE_ENV !== 'development' ? '' : '/api'}/submission/auth/token`
    try {
      const res = await $axios.post(url)
      const response: SuccessResponse<string> = res.data
      const token: Token.Model = response.content as Token.Model
      const cookieOptions = {
        path: '/',
        domain: '.' + window.location.hostname
      }
      app.$cookies.set('CloudFront-Policy', token.cfPolicy, cookieOptions)
      app.$cookies.set('CloudFront-Signature', token.cfSignature, cookieOptions)
      app.$cookies.set('CloudFront-Key-Pair-Id', token.cfKeypairId, cookieOptions)
      token.user = JSON.parse(token.user as any)
      store.commit('commons/store-token/setToken', token)
    } catch (e) {
      store.commit('commons/store-token/setToken', null)
    }
  }

  axiosInstance.interceptors.request.use((config) => {
    if ($auth.loggedIn) {
      config.headers.Authorization = `Bearer ${store.state.commons['store-token'].token.token}`
    }
    if (process.env.NODE_ENV !== 'development') {
      config.baseURL = process.env.API_URL
    } else {
      config.url = '/api' + config.url
    }
    if (config.showLoader) {
      store.commit('commons/store-loader/pending')
    }
    return config
  }, (error) => {
    if (error.config.showLoader) {
      store.commit('commons/store-loader/done')
    }
    return Promise.reject(error)
  })

  axiosInstance.interceptors.response.use((response) => {
    if (response.config.showLoader) {
      store.commit('commons/store-loader/done')
    }
    return response
  }, (error) => {
    if (error.response.config.showLoader) {
      store.commit('commons/store-loader/done')
    }
    const errorResponse: ErrorResponse = error.response.data
    if (errorResponse) {
      store.commit('commons/store-error/setError', errorResponse)
    }
    return Promise.reject(error)
  })

  initializeAxios(axiosInstance)
}

export default auth
