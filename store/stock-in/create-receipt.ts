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
    GET_BOX_LOCATION: '/request/:id/detail',
    CREATE_RECEIPT: '/location/suggest'
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
  setLocation(data:ReceiptModel.Model) {
    this.receiptDetail = data
  }

  @Mutation
  setNewReceipt(data:ReceiptModel.Model) {
    this.newReceipt = data
  }

  @Mutation
  setLocationSuccess(data:ReceiptModel.BoxLocation[]) {
    this.boxLocation = data
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

  @Action({ commit: 'setLocation', rawError: true })
  async actGetItemsList(params: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreCreateReceipt.STATE_URL.GET_BOX_LOCATION, { id: params.id })
    return await $api.get(url, { params: params.filter })
  }

  @Action({ commit: 'setNewReceipt', rawError: true })
  async actCreateNewReceipt(params: any): Promise<string | undefined> {
    try{
      const url = PathBind.transform(this.context, StoreCreateReceipt.STATE_URL.CREATE_RECEIPT)
      const response = await $api.post(url, params)
      return response.data
    } catch (error) {}
  }

  @Action({ commit: 'setLocationSuccess', rawError: true })
  async actLocationSuggestion(params: any): Promise<string | undefined> {
    try{
      const url = PathBind.transform(this.context, StoreCreateReceipt.STATE_URL.CREATE_RECEIPT)
      const response = await $api.post(url, params)
      return response.data
    } catch (error) {}
  }
}
