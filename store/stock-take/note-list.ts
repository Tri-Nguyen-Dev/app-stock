import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})
export default class StoreStockTake extends VuexModule {
  private static readonly STATE_URL = {
    GET_STOCK_TAKE_LIST: '/stock-take/list'
  }

  public stockTakeList?: any = []
  public total?: number = 0

  @Mutation
  setStockTakeList(data) {
    this.total = data.total
    this.stockTakeList = data.items
  }

  @Action({ commit: 'setStockTakeList', rawError: true })
  async actGetStockTakeList(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(
      this.context,
      StoreStockTake.STATE_URL.GET_STOCK_TAKE_LIST,
      params
    )
    const response = await $api.get(url, { params })
    return response.data
  }
}
