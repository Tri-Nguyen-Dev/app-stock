import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreCreateReceipt extends VuexModule {
  private static readonly STATE_URL = {
    GET_INVENTORY: '/seller/item-list'
  }

  public listInfor: any = {};
  public inventoryStore?: any = []
  public total?: number = 0
  public outGoingListStore?: any = []
  
  @Mutation
  setStockIn(data) {
    this.listInfor = data
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

}
