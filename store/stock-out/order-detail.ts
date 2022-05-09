import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreOrderDetail extends VuexModule {
  private static readonly STATE_URL = {
    GET_DETAIL_ORDER: '/delivery-order/:id/detail',
    GET_BOX_LOCATION: '/location/suggest',
    CREATE_RECEIPT:'/request/create'
  }

  public total?: number = 0

  public orderDetail: any = {};

  public boxLocation: any[] = [];
  public newReceipt: any = {};

  @Mutation
  setOrderDetail(data:any) {
    this.orderDetail = data
  }

  @Action({ commit: 'setOrderDetail', rawError: true })
  async actGetOrderDetail(params: { id: string }): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreOrderDetail.STATE_URL.GET_DETAIL_ORDER,params)
    return await $api.get(url)
  }

}
