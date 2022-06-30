import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreCreateReceipt extends VuexModule {
  private static readonly STATE_URL = {
    GET_INVENTORY: '/stock/list-by-seller',
    POST_DO : '/delivery-order/create'
  }

  public listInfo: any = null;
  public inventoryStore?: any = []
  public total?: number = 0
  public outGoingListStore?: any = []
  public createDOList?: any = []

  @Mutation
  setStockIn(data) {
    this.listInfo = data
  }

  @Mutation
  setInventoryList(response: any) {
    this.inventoryStore = response?.items
    this.total = response?.total
  }

  @Mutation
  setOutGoingList(outGoingList: any) {
    this.outGoingListStore = outGoingList
  }

  @Mutation
  setDeliveryOrder(createDOList: any) {
    this.createDOList = createDOList
  }

  @Action({ commit: 'setStockIn', rawError: true })
  async actGetCreateOrder( obj: any ): Promise<string | undefined> {
    return await obj
  }

  @Action({ commit: 'setInventoryList', rawError: true })
  async actGetInventoryList(params?: any): Promise<any | undefined> {
    const url = PathBind.transform(this.context, StoreCreateReceipt.STATE_URL.GET_INVENTORY, params)
    const response: any = await $api.get(url, { params })
    return response.data
  }

  @Action({ commit: 'setOutGoingList', rawError: true })
  async actOutGoingList(params?: any): Promise<string | undefined> {
    return await params
  }

  @Action({ commit: 'setDeliveryOrder', rawError: true })
  async actDeliveryOrder(params: any): Promise<string | undefined> {
    try{
      const url = PathBind.transform(this.context, StoreCreateReceipt.STATE_URL.POST_DO)
      const response = await $api.post(url, params)
      return response.data
    } catch (error) {}
  }

}
