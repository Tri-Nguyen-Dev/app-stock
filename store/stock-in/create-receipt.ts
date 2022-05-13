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
    CREATE_RECEIPT:'/request/create',
    UPDATE_RECEIPT:'/request/:id/update'
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
    } catch (error) {
    }
  }

  @Action({ commit: 'setLocationSuggestion', rawError: true })
  async actLocationSuggestion(params: any): Promise<string | undefined> {
    try{
      const url = PathBind.transform(this.context, StoreCreateReceipt.STATE_URL.GET_BOX_LOCATION)
      const response = await $api.post(url, params)
      return response.data
    } catch (error) {}
  }

  @Action({ commit: 'setNewReceipt', rawError: true })
  async actUpdateReceipt(params: any): Promise<string | undefined> {
    try{
      const url = PathBind.transform(this.context, StoreCreateReceipt.STATE_URL.UPDATE_RECEIPT,{ id: params.id })
      const response = await $api.post(url, params)
      return response.data
    } catch (error) {}
  }
}
