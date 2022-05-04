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
const auth: Plugin = ({ store }) => {
  // const axiosInstance = axios.create()
  // axiosInstance.interceptors.request.use((config) => {
  //   if (process.env.NODE_ENV !== 'development') {
  //     config.baseURL = process.env.BE_API_URL
  //   } else {
  //     config.url = '/api' + config.url
  //   }
  //   return config
  // }, (error) => {
  //   return Promise.reject(error)
  // })
  const axiosInstance = axios.create()
  axiosInstance.interceptors.request.use((config) => {

    config.headers.Authorization = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJRRXVENm95Q3J3Y0hBU1NfdVkwY0RCZXZ5Q242eC1yeXRvNlZqQkRTUExBIn0.eyJleHAiOjE2NTEyNTI2NzAsImlhdCI6MTY1MTIxNjY3MSwiYXV0aF90aW1lIjoxNjUxMjE2NjcwLCJqdGkiOiI3MzIwYWZhMy01YmRlLTQyMDMtOTUxMi1iNzNhZTFhZDZmMmYiLCJpc3MiOiJodHRwOi8vMTAuMC42LjE3NTo4MTgwL3JlYWxtcy9haXJ0YWciLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNmJiMThkNDQtMzVjNi00YzU2LTg1M2ItZTk0YTRlZDFiNGVkIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWlydGFnLXNlcnZpY2UiLCJub25jZSI6Inhqb0VMZjQiLCJzZXNzaW9uX3N0YXRlIjoiZDdhZWU4NmEtMjk4Ny00YjcwLTk0NjgtZjUzZTBmYmFkMTU1IiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1haXJ0YWciXX0sInJlc291cmNlX2FjY2VzcyI6eyJhaXJ0YWctc2VydmljZSI6eyJyb2xlcyI6WyJhZG1pbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInNpZCI6ImQ3YWVlODZhLTI5ODctNGI3MC05NDY4LWY1M2UwZmJhZDE1NSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6Im5hbSB0ZXN0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoibmFtbmQyIiwiZ2l2ZW5fbmFtZSI6Im5hbSIsImZhbWlseV9uYW1lIjoidGVzdCIsImVtYWlsIjoibmFtbmQyQHJpa2tlaXNvZnQuY29tIn0.aYXzuvzWOJS5WDvydNNyWHAYBeXAXNBvU5YB8cZzqS8z7gMNvDiK3iVKEdd42gF6ModQ39QYK-LdLXgdk6FWwGfkYLME6FK6F4WMlVoSEQ_zFLFaKg0lJOE2phuW_oPkttQhM6-U6o7IhuYUzYWi-bAwfWX_otwf2opSt3K2Jww4Tfc8yKTMlWhWAG_nQ68UD-2gq5eDAj95G6Me7tKrkh7Kaq7cKcCjPYzlocnjxpi659TDjDs0yleykWhKvNw0eT9aiICM0ZhinESYtpV4Dd7teYdNeP5--zZSvaNrfffHxwnqIY9r0CCtMi1DV4aykxNrTurNonAxKKzaEHalKQ'

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
