import { Middleware } from '@nuxt/types'

const authenticate: Middleware = ({ store, redirect }) => {
  // if (!store.$auth.user || !store.state.commons['store-token'].token) {
  //   redirect('/login')
  // }
}

export default authenticate
