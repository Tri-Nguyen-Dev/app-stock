import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
import { Receipt as ReceiptModel } from '~/models/Receipt'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreCreateReceipt extends VuexModule {
  private static readonly STATE_URL = {
    GET_DETAIL_RECEIPT: '/request/:id/detail',
    GET_BOX_LOCATION: '/location/suggest',
    CREATE_RECEIPT:'/request/create'
  }

  public total?: number = 0

  public receiptDetail: any = {};

  public boxLocation: any[] = [];
  public newReceipt: any = {};

  @Mutation
  setReceiptDetail(data:ReceiptModel.Model) {
    this.receiptDetail = data
  }

  @Mutation
  setNewReceipt(data:any) {
    this.newReceipt = data
  }

  @Mutation
  setLocationSuggestion(data:ReceiptModel.BoxLocation[]) {
    this.boxLocation = data
  }

  @Action({ commit: 'setReceiptDetail', rawError: true })
  async actGetReceiptDetail(params: { id: number }): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreCreateReceipt.STATE_URL.GET_DETAIL_RECEIPT,params)
    return await $api.get(url)
  }

}
