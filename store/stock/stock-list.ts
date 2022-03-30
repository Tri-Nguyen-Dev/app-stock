import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { Stock } from '~/models/Stock'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreStock extends VuexModule {
  private static readonly STATE_URL = {
    GET_STOCK: '/stock/list',
    DELETE_STOCK: '/stock/delete'
  }

  public stockList?: Stock.Model[] = []
  public total?: number

  @Mutation
  setStockList(data: any) {
    this.stockList = data.data.items
    this.total = data.data.total
  }

  @Action({ commit: 'setStockList', rawError: true })
  async actGetStockList(
    data?: any
  ): Promise<string | undefined> {
    const stockList = require('~/mocks/products.json')  
    try {
      const url = PathBind.transform(
        this.context,
        StoreStock.STATE_URL.GET_STOCK,
        data?.params
      )
      const response = await $api.get(url, { params: data?.params })

      if (!response.data) {
        return stockList
      }

      return response.data
    } catch (error) {
      return stockList
    }
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
      const response = await $api.post(url, ids)

      if (!response.data) {
        return 
      }

      return response.data
    } catch (error) {
    }
  }
}
