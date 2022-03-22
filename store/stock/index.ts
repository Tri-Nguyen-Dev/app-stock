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
  }

  public stockList: [] = []
  public stockTotal: number = 0

  @Mutation
  setProductList(data: []) {
    this.stockList = data
  }

  @Action({ commit: 'setProductList', rawError: true })
  async actGetProductList(
    data?: StockModel.StockBody
  ): Promise<string | undefined> {
    const stockList = require('~/mocks/products.json')  
    try {
      const url = PathBind.transform(
        this.context,
        Stock.STATE_URL.GET_STOCK,
        data?.params
      )
      const response: SuccessResponse<any> = await $api.post(url, data?.filter, { params: data?.params })

      if (!response.content) {
        return stockList
      }

      return response.content
    } catch (error) {
      return stockList
    }
  }
}
