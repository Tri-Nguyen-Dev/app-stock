import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})
export default class StoreStockTake extends VuexModule {
  private static readonly STATE_URL = {
    GET_STOCK_TAKE_LIST: '/stock-take/list',
    DELETE_STOCK_TAKE_LIST: '/stock-take/list/delete',
    EXPORT_RECEIPT: '/stock-take/:id/pdf-stock-take-box'
  }

  public stockTakeList?: any = []
  public total?: number = 0
  public receiptUrl: any = {}

  @Mutation
  setStockTakeList(data) {
    this.total = data.total
    this.stockTakeList = data.items
  }
  
  @Mutation
  setReceiptUrl(receiptUrl: any) {
    this.receiptUrl = receiptUrl
  }

  @Action({ commit: 'setStockTakeList', rawError: true })
  async actGetStockTakeList(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(
      this.context,
      StoreStockTake.STATE_URL.GET_STOCK_TAKE_LIST,
      params
    )
    const response = await $api.get(url, { params })
    return response.data
  }

  @Action({ rawError: true })
  async actDeleteStockTakeList(ids?: string[]): Promise<string | undefined> {
    const url = PathBind.transform(
      this.context,
      StoreStockTake.STATE_URL.DELETE_STOCK_TAKE_LIST
    )
    const response = await $api.post(url, { ids })
    return response.data
  }
  
  @Action({ commit: 'setReceiptUrl', rawError: true })
  async actGetReceiptLable(params: {id: string}): Promise<string | undefined> {
    if(!params.id) return ''
    try {
      const url = PathBind.transform(this.context, StoreStockTake.STATE_URL.EXPORT_RECEIPT, params)
      const response: any =  await $api.get(url, { responseType: 'blob' })
      const file = new Blob([response], { type: 'application/pdf' })
      return URL.createObjectURL(file)
    } catch (error) {
      return ''
    }
  }
}
