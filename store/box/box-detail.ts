import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreBox extends VuexModule {
  private static readonly STATE_URL = {
    GET_BOX_DETAIL: '/api/boxDetail/list',
    GET_BOX: '/api/box/list' 

  }

  public stockList?: any = []
  public boxDetail?: {} = {}
  public totalStockRecords?: number = 0

  @Mutation
  setBoxList(data: any) {
    this.boxDetail = data
  }

  @Mutation
  setStockList(data: any) {
    this.stockList = data.items
    this.totalStockRecords = data.total
  }

  @Action({ commit: 'setStockList', rawError: true })
  async actGetBoxDetailFilter(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBox.STATE_URL.GET_BOX_DETAIL, params)
    const response: any = await $api.get(url, {params})
    return response.data
  }

  @Action({ commit: 'setBoxList', rawError: true })
  async actGetBoxItem(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBox.STATE_URL.GET_BOX, params)
    const response: any = await $api.get(url, {params})
    return response[0]
  }


}