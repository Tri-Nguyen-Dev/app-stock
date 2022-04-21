import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreBoxSize extends VuexModule {
  private static readonly STATE_URL = {
    GET_BOX_SIZE: '/box-size/list'
  }

  public boxSizeList?: any[] = []
  public totalBoxSizeRecords?: number = 0

  @Mutation
  setBoxSizeList(response: any) {
    this.boxSizeList = response?.items
    this.totalBoxSizeRecords = response?.total
  }

  @Action({ commit: 'setBoxSizeList', rawError: true })
  async actGetBoxSizeList(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBoxSize.STATE_URL.GET_BOX_SIZE, params)
    const response: any = await $api.get(url, { params })
    return response.data
  }

}
