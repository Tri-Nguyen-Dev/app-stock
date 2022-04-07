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
    GET_ITEM_INFO: '/api/stock/:stockId/box/:boxId/detail'
  }

  public total?: number = 0

  public stockDetail: {};

  public itemsList: any = {}
  public itemDetail: any = {}

  @Mutation
  setStockDetail(data:any) {
    this.total = data.total
    this.stockDetail = data
  }

  @Mutation
  setItemsList(itemsList: StockModel.BoxModel) {
    this.itemsList = itemsList
  }

  @Mutation
  setItemDetail(itemDetail: StockModel.BoxModel) {
    this.itemDetail = itemDetail
  }

  @Action({ commit: 'setStockDetail', rawError: true })
  async actGetStockDetail(params: { id: number }): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.GET_STOCK_DETAIL,params)
    return await $api.get(url)
  }

  @Action({ commit: 'setItemsList', rawError: true })
  async actGetItemsList(params: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.GET_ITEMS_LIST, { id: params.id })
    return await $api.get(url, { params: params.filter })
  }

  @Action({ commit: 'setItemDetail', rawError: true })
  async actGetItemsDetail(params: {stockId: number, boxId: number}): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.GET_ITEM_INFO, params)
    return await $api.get(url)
  }
}
