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
    CREATE_STOCK: '/stock/create',
    GET_ITEM_INFO: '/stock/:stockId/box/:boxId/detail',
    GET_ITEM__DETAIL: '/stock/:stockId/box/:boxId/detail',
    UPDATE_STOCK: '/stock/:id/update',
    GET_STOCK_HISTORY: '/stock/:stockId/box/:boxId/history',
    DELETE_ITEMS: '/stock/:id/box/delete',
    UPDATE_ITEM: '/stock/:stockId/box/:boxId/update',
    GET_STOCK_BY_BARCODE: '/stock/barcode/:barcode',
    GET_HISTORY_LOCATION: '/stock/:stockId/box/:boxId/location-history'
  }

  public total?: number = 0
  public stockDetail: any = {};
  public itemsList: any = {}
  public itemDetail: any = {}
  public newStockDetail: any = {}
  public historyList: any = {}
  public historyLocationList: any = {}

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
  setNewStock(newStockDetail: StockModel.CreateStock) {
    this.newStockDetail = newStockDetail
  }

  @Mutation
  setHistoryStock(historyList: {}) {
    this.historyList = historyList
  }

  @Mutation
  setHistoryLocation(historyLocationList: {}) {
    this.historyLocationList = historyLocationList
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

  @Action({ commit: 'setNewStock', rawError: true })
  async actCreateNewStock(params: any): Promise<string | undefined> {
    try{
      const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.CREATE_STOCK)
      const response = await $api.post(url, params)
      return response.data
    } catch (error) {}
  }

  @Action({ rawError: true })
  async actUpdateStock(params: StockModel.ModelDetailEdit): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.UPDATE_STOCK, { id: this.stockDetail.data.id })
    return await $api.post(url, params)
  }

  @Action({ commit: 'setHistoryStock', rawError: true })
  async actGetHistoryStock(params: {stockId: number, boxId: number}): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.GET_STOCK_HISTORY, params)
    return await $api.get(url)
  }

  @Action({ rawError: true })
  async actDeleteItemsById(ids?: string[]): Promise<string | undefined> {
    try {
      const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.DELETE_ITEMS, { id: this.stockDetail.data.id })
      const response = await $api.post(url, { ids })
      if(!response.data) {
        return
      }
      return response.data
    } catch (error) {
    }
  }

  @Action({ rawError: true })
  async actUpdateItem(params: {path: any, body: StockModel.ModelEditItem}): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.UPDATE_ITEM, params.path)
    return await $api.post(url, params.body)
  }

  @Action({ commit: 'setStockDetail', rawError: true })
  async actGetStockByBarcode(params: { id: number }): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.GET_STOCK_BY_BARCODE,params)
    return await $api.get(url)
  }

  @Action({ commit: 'setHistoryLocation', rawError: true })
  async actGetHistoryLocation(params: {stockId: number, boxId: number}): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.GET_HISTORY_LOCATION, params)
    return await $api.get(url)
  }
}
