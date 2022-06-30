import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
import { User } from '~/models/User'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreUser extends VuexModule {
  private static readonly STATE_URL = {
    USER_GET:    '/user/me',
    USER_CREATE: '/user/create'
  }

  public user: User.Model | undefined
  public token: string = ''

  @Mutation
  setUser(user: User.Model) {
    this.user = user
  }

  @Mutation
  setToken(token: string) {
    this.token = token
  }

  @Action({ commit: 'setUser', rawError: true })
  async actGetUserDetail(): Promise<User.Model | undefined> {
    const url = PathBind.transform(this.context, StoreUser.STATE_URL.USER_GET)
    const response: any = await $api.get(url)
    return response.data
  }

  @Action({ commit: 'setUser', rawError: true })
  async actRegisterUser(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreUser.STATE_URL.USER_CREATE)
    const response: any = await $api.post(url, params)
    return response.data
  }
}
