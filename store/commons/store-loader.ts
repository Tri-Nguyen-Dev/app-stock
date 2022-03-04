import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

export namespace Loader {

}

@Module({
  stateFactory: true,
  namespaced: true
})
export default class StoreLoader extends VuexModule {

  public loading: boolean = false

  public requestsPending: number = 0

  @Mutation
  pending() {
    if (this.requestsPending === 0) {
      this.loading = true
    }

    this.requestsPending++
  }

  @Mutation
  done() {
    if (this.requestsPending >= 1) {
      this.requestsPending--
    }

    if (this.requestsPending <= 0) {
      this.loading = false
    }
  }
}
