import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

@Module({
  stateFactory: true,
  namespaced: true
})
export default class StoreCommon extends VuexModule {

  public viewLoading = false

  @Mutation
  setViewLoading(data: boolean) {
    this.viewLoading  = data
  }
}

