import { namespace } from 'vuex-class'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind, SuccessResponse } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreBox extends VuexModule {
  private static readonly STATE_URL = {
    GET_ALL_BOX: '/submission/user/:userId/get-all-master-data',
  }

  public boxData: any = null

  @Mutation
  setBoxData(boxData: {}) {
    this.boxData = boxData
  }

  @Action({ commit: 'setBoxData', rawError: true })
  async actGetBoxData(): Promise<string | undefined> {
    // const url = PathBind.transform(this.context, StoreBox.STATE_URL.GET_ALL_BOX)
    const url = 'https://62315a6305f5f4d40d7871ae.mockapi.io/box'
    const response: any = await $api.get(url)
    return response
  }
}