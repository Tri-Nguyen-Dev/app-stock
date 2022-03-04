import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { SuccessResponse } from '~/utils/response/success-response'

class ApiWrapper {

  public $axios!: NuxtAxiosInstance

  constructor(axios: NuxtAxiosInstance) {
    this.$axios = axios
  }

  public async get<T = any, R = SuccessResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    const response: AxiosResponse<R> = await this.$axios.get(url, config)
    return response.data
  }

  public async post<T = any, R = SuccessResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const response: AxiosResponse<R> = await this.$axios.post(url, data, config)
    return response.data
  }

  public async put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const response: AxiosResponse<R> = await this.$axios.put(url, data, config)
    return response.data
  }

  public async delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    const response: AxiosResponse<R> = await this.$axios.delete(url, config)
    return response.data
  }

}

// eslint-disable-next-line import/no-mutable-exports
let $api: ApiWrapper

export function initializeAxios(axiosInstance: any) {

  $api = new ApiWrapper(axiosInstance)

}

export { $api }
