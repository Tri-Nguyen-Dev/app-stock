import { Middleware } from '@nuxt/types'

const authenticate: Middleware = ({ store, redirect }) => {
  if (!store.$auth.loggedIn) {
    redirect('/login')
  }
}

export default authenticate
