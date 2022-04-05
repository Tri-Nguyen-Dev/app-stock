import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { Box } from '~/models/Box'
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
  public boxList?: Box.Model[] = []
  public totalBoxRecords?: number = 0

  @Mutation
  setBoxList(data: any) {
    this.boxList = data
  }

  @Mutation
  setStockList(data: any) {
    this.stockList = data.items
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
    return response
  }


}