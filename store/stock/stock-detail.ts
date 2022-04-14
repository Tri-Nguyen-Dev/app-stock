import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
import { Stock as StockModel } from '~/models/Stock'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreStockDetail extends VuexModule {
  private static readonly STATE_URL = {
    GET_STOCK_DETAIL: '/stock/:id/detail',
    GET_ITEMS_LIST: '/stock/:id/box/list',
    GET_ITEM__DETAIL: '/stock/:stockId/box/:boxId/detail',
    UPDATE_STOCK: '/stock/:id/update',
    GET_STOCK_HISTORY: '/stock/:stockId/box/:boxId/history',
    DELETE_ITEMS: '/stock/:id/box/delete',
    UPDATE_ITEM: '/stock/:stockId/box/:boxId/update'
  }

  public total?: number = 0
  public stockDetail: any = {};
  public itemsList: any = {}
  public itemDetail: any = {}
  public historyList: any = {}

  @Mutation
  setStockDetail(data:StockModel.ModelDetail) {
    this.stockDetail = data
  }

  @Mutation
  setItemsList(itemsList: StockModel.BoxModel) {
    this.itemsList = itemsList
    this.total = itemsList.data.total
  }

  @Mutation
  setItemDetail(itemDetail: StockModel.BoxModel) {
    this.itemDetail = itemDetail
  }

  @Mutation
  setHistoryStock(historyList: {}) {
    this.historyList = historyList
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
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.GET_ITEM__DETAIL, params)
    return await $api.get(url)
  }

  @Action({ commit: 'setStockDetail', rawError: true })
  async actUpdateStock(params: StockModel.ModelDetailEdit): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.UPDATE_STOCK, { id: this.stockDetail.data.id })
    return await $api.post(url, params.data)
  }

  @Action({ commit: 'setHistoryStock', rawError: true })
  async actGetHistoryStock(params: {stockId: number, boxId: number}): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.GET_STOCK_HISTORY, params)
    return await $api.get(url)
  }

  @Action({ rawError: true })
  async actDeleteItemsById(ids?: string[]): Promise<string | undefined> {
    try {
      const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.DELETE_ITEMS, {id: this.stockDetail.data.id})
      const response = await $api.post(url, { ids })
      if(!response.data) {
        return
      }
      return response.data
    } catch (error) {
    }
  }

  @Action({ commit: 'setItemDetail', rawError: true })
  async actUpdateItem(params: StockModel.ModelEditItem): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.UPDATE_ITEM, {stockId: this.stockDetail.id, boxId: this.itemDetail.id})
    return await $api.post(url, params.data)
  }
}
