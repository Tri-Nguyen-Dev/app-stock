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
  const axiosInstance = axios.create()
  axiosInstance.interceptors.request.use((config) => {
  
    config.headers.Authorization = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJRRXVENm95Q3J3Y0hBU1NfdVkwY0RCZXZ5Q242eC1yeXRvNlZqQkRTUExBIn0.eyJleHAiOjE2NTE2OTQ3NTEsImlhdCI6MTY1MTY1ODc1MSwiYXV0aF90aW1lIjoxNjUxNjU4NzUxLCJqdGkiOiJiNGI5ZmUyOS1hNWIxLTQ0OTYtYTE3MC03NTMxZTdlOGY4MTIiLCJpc3MiOiJodHRwOi8vMTAuMC42LjE3NTo4MTgwL3JlYWxtcy9haXJ0YWciLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNDMwMmQxMGItMmFjOS00MTVhLTg1MWItZjRhN2QwMDBhMmM5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWlydGFnLXNlcnZpY2UiLCJub25jZSI6IkZFN2FuR0ciLCJzZXNzaW9uX3N0YXRlIjoiYWEwODdlNGItZjAyZC00NDJjLWFmZTgtNTdjZDgwMDhkMzlmIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1haXJ0YWciXX0sInJlc291cmNlX2FjY2VzcyI6eyJhaXJ0YWctc2VydmljZSI6eyJyb2xlcyI6WyJhZG1pbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInNpZCI6ImFhMDg3ZTRiLWYwMmQtNDQyYy1hZmU4LTU3Y2Q4MDA4ZDM5ZiIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiaHVhbm5zIiwiZW1haWwiOiJodWFubnNAcmlra2Vpc29mdC5jb20ifQ.Hy4JUC9FDmIeVl_WsQh72lLR59PmCoXuR22rzbdJCayOGSzVDMh52JxYI_7z8KGFosLoRoiQ96AFx99GK9LSEbf3DsjeJpTvvH6-F_fOtjY5Ozxs6Ec40nh1gQbV5siRFPpSmY5-H5UF4e3BpPXmalsBVf_mIRnrinXkXn1fhg52E7AsrpGHQdTLxdhoZb68W5qTBiZIADWUMpK89cRMc7pcVByvhXnF4EamGKPyhG_sMndc9x1302furRrclCT5NuHu5ym6mehE0jkmsB3JMLrriwheifnJr3uzluzzZ_WrIogyFtUbjQTni1GPBA4V6jPHyJ8D62qqTXXV0nWGZA'
  
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
