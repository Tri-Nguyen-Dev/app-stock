import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreBox extends VuexModule {
  private static readonly STATE_URL = {
    GET_BOX_TRANSFER: '/box/details'
  }

  public listBoxTransfer?: any = []
  public totalBoxTransfer?: number = 0

  @Mutation
  setListBoxTransfer(data: any) {
    this.totalBoxTransfer = data?.total
    this.listBoxTransfer = data?.items
  }

  @Action({ commit: 'setListBoxTransfer', rawError: true })
  async actGetBoxListTranfer(params: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBox.STATE_URL.GET_BOX_TRANSFER, params)
    const response: any = await $api.get(url, { params })
    return response.data
  }
}