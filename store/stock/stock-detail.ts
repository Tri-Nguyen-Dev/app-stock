import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
import { Stock as StockModel } from '~/models/Stock'


@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreStockDetail extends VuexModule {
  private static readonly STATE_URL = {
    GET_STOCK_DETAIL: '/api/stock/:id/detail',
    GET_ITEMS_LIST: '/api/stock/:id/box/list',
    GET_ALL_BOX: '/submission/user/:userId/get-all-master-data'
  }

  public stockDetail: any = {}

  public itemsList: StockModel.ModelDetail[] = []

  @Mutation
  setStockDetail(stockDetail: StockModel.ModelDetail) {
    this.stockDetail = stockDetail
  }

  @Mutation
  setItemsList(itemsList: StockModel.ModelDetail[]) {
    this.itemsList = itemsList
  }

  @Action({ commit: 'setStockDetail', rawError: true })
  async actGetStockDetail(params: { id: number }): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.GET_STOCK_DETAIL,params)
    return await $api.get(url)
  }

  @Action({ commit: 'setItemsList', rawError: true })
  async actGetItemsList(params: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.GET_ITEMS_LIST, { id: params.id })
    return await $api.get(url, { params})
  }
}
