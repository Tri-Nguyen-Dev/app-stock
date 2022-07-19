import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreOrderList extends VuexModule {
  public indexTag: number = 0

  @Mutation
  setIndexTag(index: number) {
    this.indexTag = index
  }
}