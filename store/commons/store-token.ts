import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { User } from '~/models/User'

@Module({
  stateFactory: true,
  namespaced: true
})
export default class StoreToken extends VuexModule {

  public userToken!: User.Token

  @Mutation
  setToken(userToken: User.Token) {
    this.userToken = userToken
  }
}
