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
    GET_STOCK: '/stock',
    DELETE_STOCK: '/stock/:id',
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
  async deleteStockById(
    params: StockModel.DeleteStockParams
  ): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Stock.STATE_URL.DELETE_STOCK,
        params
      )
      const response: SuccessResponse<any> = await $api.delete(url)
      return response.content
    } catch (error) {}
  }
}
