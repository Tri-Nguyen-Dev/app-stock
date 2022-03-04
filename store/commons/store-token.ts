import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

export namespace Token {

  export interface UserDetail {
    displayName: string,
    pictureUrl: string,
    divisionName: string
  }

  export interface User {
    id: string,
    email: string,
    role: string,
    userDetail: UserDetail
  }

  export interface Model {
    token?: string
    userId?: string
    user?: User
    cfKeypairId?: string
    cfSignature?: string
    cfPolicy?: string
  }
}

@Module({
  stateFactory: true,
  namespaced: true
})
export default class StoreToken extends VuexModule {

  public token!: Token.Model

  @Mutation
  setToken(token: Token.Model) {
    this.token = token
  }

}
