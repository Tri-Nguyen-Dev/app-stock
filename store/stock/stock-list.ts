import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { Stock } from '~/models/Stock'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreStock extends VuexModule {
  private static readonly STATE_URL = {
    GET_STOCK: '/api/stock/list',
    DELETE_STOCK: 'api/stock/delete'
  }

  public stockList?: Stock.Model[] = []
  public total?: number = 0

  @Mutation
  setStockList(data: any) {  
    this.total = data.total
    this.stockList = data.items
  }

  @Action({ commit: 'setStockList', rawError: true })
  async actGetStockList(
    params?: any
  ): Promise<string | undefined> {
  
    const url = PathBind.transform(
      this.context,
      StoreStock.STATE_URL.GET_STOCK,
      params
    )
    const response = await $api.get(url, { params })
    return response.data
  }

  @Action({ rawError: true })
  async actDeleteStockByIds(
    ids?: string[]
  ): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        StoreStock.STATE_URL.DELETE_STOCK
      )
      const response = await $api.post(url, { ids })

      if (!response.data) {
        return 
      }

      return response.data
    } catch (error) {
    }
  }
}
