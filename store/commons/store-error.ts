import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

export namespace Error {
  export interface Model {
    code?: string
    message?: string
  }
}

@Module({
  stateFactory: true,
  namespaced: true
})
export default class StoreError extends VuexModule {

  public error: Error.Model = {}

  @Mutation
  setError(error: Error.Model) {
    this.error = { ...this.error, ...error }
  }

}
