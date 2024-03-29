import { Middleware } from '@nuxt/types'
const authenticate: Middleware = async ({ store }) => {
  if (!store.$auth.loggedIn) {
    await store.$auth.loginWith('keycloak')
  } else if (!store.state['user-auth']['store-user'].user) {
    await store.dispatch('user-auth/store-user/actGetUserDetail')
  }
}

export default authenticate
