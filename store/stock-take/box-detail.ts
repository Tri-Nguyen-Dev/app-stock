import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreBoxStockTake extends VuexModule {
  private static readonly STATE_URL = {
    BOX_STOCK_TAKE_DETAIL: '/stock-take/:id/detail',
    SUBMIT_BOX_STOCK_TAKE_DETAIL: '/stock-take/:id/submit',
    ASSIGN_BOX_STOCK_TAKE: '/stock-take/assign',
    EXPORT_STOCK_TAKE: '/stock-take/:id/pdf'

  }

  public boxStockTakeDetail: any = {}
  public receiptUrl: any = {}

  @Mutation
  setBoxStockTakeDetail(boxStockTakeDetail:any) {
    this.boxStockTakeDetail = boxStockTakeDetail.data
  }

  @Mutation
  setReceiptUrl(receiptUrl: any) {
    this.receiptUrl = receiptUrl
  }

  @Action({ commit: 'setBoxStockTakeDetail', rawError: true })
  async actGetBoxStockTakeDetail(params: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBoxStockTake.STATE_URL.BOX_STOCK_TAKE_DETAIL,params)
    return await $api.get(url)
  }

  @Action({ rawError: true })
  async actSubmitBoxStockTakeDetail(params: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBoxStockTake.STATE_URL.SUBMIT_BOX_STOCK_TAKE_DETAIL,{ id: params.id })
    return await $api.post(url, params.submitData)
  }

  @Action({ rawError: true })
  async actGetAssignBoxStockTake(params: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBoxStockTake.STATE_URL.ASSIGN_BOX_STOCK_TAKE)
    return await $api.post(url, params)
  }

  @Action({ commit: 'setReceiptUrl', rawError: true })
  async actGetStockTakeLable(params: {id: string}): Promise<string | undefined> {
    try {
      // if(!params.id) return ''
      const url = PathBind.transform(this.context, StoreBoxStockTake.STATE_URL.EXPORT_STOCK_TAKE, { id: params.id })
      const response: any =  await $api.get(url, { responseType: 'blob' })
      const file = new Blob([response], { type: 'application/pdf' })
      return URL.createObjectURL(file)
    } catch (error) {
      return ''
    }
  }
}
