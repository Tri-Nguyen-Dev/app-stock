import { namespace } from 'nuxt-property-decorator'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind, SuccessResponse } from '~/utils'

export namespace Stock {
  export class StockDetailId {
    id?: number
  }
}

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreStock extends VuexModule {
  private static readonly STATE_URL = {
    GET_STOCK_DETAIL: 'https://622701772dfa52401811d3d2.mockapi.io/api/v1/productList/:id'
  }

  public stockDetail: {} = {}

  @Mutation
  getStockDetail(stockDetail: {}) {
    this.stockDetail = stockDetail
  }

  @Action({ commit: 'getStockDetail', rawError: true })
  async actGetStockDetail(params: Stock.StockDetailId): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStock.STATE_URL.GET_STOCK_DETAIL, params)
    const response: SuccessResponse<string> = await $api.get(url)
    return response.content
  }
}
