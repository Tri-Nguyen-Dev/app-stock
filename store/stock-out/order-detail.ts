import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
import { OrderDetail } from '~/models/OrderDetail'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreOrderDetail extends VuexModule {
  private static readonly STATE_URL = {
    GET_DETAIL_ORDER: '/delivery-order/:id/detail',
    UPDATE_ORDER: '/delivery-order/:id/update'
  }

  public total?: number = 0
  public orderDetail: OrderDetail.Model = {};
  public boxLocation: any[] = [];
  public newReceipt: any = {};
  public orderUpdate: any = {};

  @Mutation
  setOrderDetail(data: any) {
    this.orderDetail = data.data
  }

  @Mutation
  updateProgressOrder(data: any) {
    this.orderUpdate = data
  }

  @Action({ commit: 'setOrderDetail', rawError: true })
  async actGetOrderDetail(params: { id: string }): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreOrderDetail.STATE_URL.GET_DETAIL_ORDER, params)
    return await $api.get(url)
  }

  @Action({ commit: 'updateProgressOrder', rawError: true })
  async actPostUpdateProgressOrder(data: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreOrderDetail.STATE_URL.UPDATE_ORDER, { id: data.id })
    return await $api.post(url, data)
  }
}
