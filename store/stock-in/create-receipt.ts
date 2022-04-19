import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
import { Receipt as ReceiptModel } from '~/models/Receipt'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreCreateReceipt extends VuexModule {
  private static readonly STATE_URL = {
    GET_DETAIL_RECEIPT: '/request/:id/detail'
  }

  public total?: number = 0

  public receiptDetail: any = {};

  @Mutation
  setReceiptDetail(data:ReceiptModel.Model) {
    this.receiptDetail = data
  }

  // @Mutation
  // setItemsInBox(itemsList: ReceiptModel.BoxModel) {
  //   this.itemsList = itemsList
  //   this.total = itemsList.data.total
  // }

  // @Mutation
  // setItemDetail(itemDetail: ReceiptModel.BoxModel) {
  //   this.itemDetail = itemDetail
  // }

  @Action({ commit: 'setReceiptDetail', rawError: true })
  async actGetReceiptDetail(params: { id: number }): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreCreateReceipt.STATE_URL.GET_DETAIL_RECEIPT,params)
    return await $api.get(url)
  }

  //   @Action({ commit: 'setItemsList', rawError: true })
  //   async actGetItemsList(params: any): Promise<string | undefined> {
  //     const url = PathBind.transform(this.context, StoreCreateBox.STATE_URL.GET_ITEMS_LIST, { id: params.id })
  //     return await $api.get(url, { params: params.filter })
  //   }

//   @Action({ commit: 'setItemDetail', rawError: true })
//   async actGetItemsDetail(params: {receiptId: number, boxId: number}): Promise<string | undefined> {
//     const url = PathBind.transform(this.context, StoreCreateBox.STATE_URL.GET_ITEM_INFO, params)
//     return await $api.get(url)
//   }
}
