import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { Delivery } from '~/models/Delivery'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreDelivery extends VuexModule {
  private static readonly STATE_URL = {
    GET_STOCK: '/stock/delivery',
    DELETE_STOCK: '/stock/delete'
  }

  public deliveryList?: Delivery.Model[] = []
  public total?: number = 0

  @Mutation
  setDeliveryList(data: any) {
    this.total = data.total
    this.deliveryList = data.items
  }

  @Action({ commit: 'setDeliveryList', rawError: true })
  async actGetDeliveryList(
    params?: any
  ): Promise<string | undefined> {
    const url = PathBind.transform(
      this.context,
      StoreDelivery.STATE_URL.GET_STOCK,
      params
    )
    const response = await $api.get(url, { params })
    return response.data
  }
}