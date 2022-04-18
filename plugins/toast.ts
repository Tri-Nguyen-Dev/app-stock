
import { Plugin } from '@nuxt/types'
import  { ToastServiceMethods } from 'primevue/toastservice'

declare module 'vue/types/vue' {
    interface Vue {
        $toast: ToastServiceMethods
    }
}
    
}
  
export default toast