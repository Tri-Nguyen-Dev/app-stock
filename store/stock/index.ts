import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { StockModel } from './../../models/Stock'
import { SuccessResponse } from '~/utils/response/success-response'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true,
})
export default class Stock extends VuexModule {
  private static readonly STATE_URL = {
    GET_STOCK: '/product/list',
    DELETE_STOCK: '/product/delete',
  }

  public stockList: [] = []

  @Mutation
  setProductList(data: []) {
    this.stockList = data
  }

  @Action({ commit: 'setProductList', rawError: true })
  async actGetProductList(params?: any): Promise<string | undefined> {
    const stockList = require('~/mocks/products.json')
    try {
      const url = PathBind.transform(
        this.context,
        Stock.STATE_URL.GET_STOCK,
        params
      )
      const response: SuccessResponse<any> = await $api.get(url)

      if (!response.content) {
        return stockList
      }

      return response.content
    } catch (error) {
      return stockList
    }
  }

  @Action({ rawError: true })
  async deleteStock(
    params: StockModel.DeleteStockParams
  ): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Stock.STATE_URL.DELETE_STOCK,
        params
      )
      const response: SuccessResponse<any> = await $api.post(url)
      return response.content
    } catch (error) {}
  }
}
