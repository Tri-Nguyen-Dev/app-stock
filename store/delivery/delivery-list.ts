import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { DeliveryList } from '~/models/Delivery'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreDelivery extends VuexModule {
  private static readonly STATE_URL = {
    GET_DELIVERY: '/delivery-order/list',
    DELETE_DELIVERY: '/delivery-order/list/delete'
  }

  public deliveryList?: DeliveryList.Model[] = []
  public total?: number = 0

  @Mutation
  setDeliveryList(data: any) {
    this.total = data.total
    this.deliveryList = data.items
  }

  @Action({ commit: 'setDeliveryList', rawError: true })
  async getDeliveryList(
    params?: any
  ): Promise<string | undefined> {
    const url = PathBind.transform(
      this.context,
      StoreDelivery.STATE_URL.GET_DELIVERY,
      params
    )
    const response = await $api.get(url, { params })
    return response.data
  }

  @Action({ rawError: true })
  async actDeleteDeliveryByIds(
    ids?: string[]
  ): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        StoreDelivery.STATE_URL.DELETE_DELIVERY
      )
      const response = await $api.post(url, ids)
      if (!response.data) {
        return
      }
      return response.data
    } catch (error) {
    }
  }
}