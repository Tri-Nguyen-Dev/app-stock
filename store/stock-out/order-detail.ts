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
    UPDATE_ORDER: '/delivery-order/:id/update',
    ASSIGN_DRIVER: '/delivery-order/set-delivery',
    GET_ORIGINAL_LABEL: '/delivery-order/:id/original-box/pdf',
    GET_OUTGOING_LABEL: '/delivery-order/:id/outgoing-box/pdf'
  }

  public total?: number = 0
  public orderDetail: OrderDetail.Model = {};
  public boxLocation: any[] = [];
  public newReceipt: any = {};
  public orderUpdate: any = {};
  public dataAssignDriver: any = {};
  public packingLabelUrl: any = {};

  @Mutation
  setOrderDetail(data: any) {
    this.orderDetail = data.data
  }

  @Mutation
  updateProgressOrder(data: any) {
    this.orderUpdate = data
    this.orderDetail.status = data.data.status
  }

  @Mutation
  assignDriver(data: any) {
    this.dataAssignDriver = data.data
    if(data.data.items.length===1) {
      this.orderDetail.driver = data.data.items[0].driver
      this.orderDetail.status = data.data.items[0].status
    }
  }

  @Mutation
  setPackingLabel(packingLabelUrl: any) {
    this.packingLabelUrl = packingLabelUrl
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

  @Action({ commit: 'assignDriver', rawError: true })
  async actPostAssignDriver(data: any): Promise<any | undefined> {
    const url = PathBind.transform(this.context, StoreOrderDetail.STATE_URL.ASSIGN_DRIVER)
    return await $api.post(url, data)
  }

  @Action({ commit: 'setOrderDetail', rawError: true })
  updateDriverInOrderDetail(data){
    return data
  }

  @Action({ commit: 'setPackingLabel', rawError: true })
  async actGetPackingLabel({ params, type }): Promise<string | undefined> {
    if(!params.id) return ''
    try {
      const path = type === 'originalBox' ? StoreOrderDetail.STATE_URL.GET_ORIGINAL_LABEL : StoreOrderDetail.STATE_URL.GET_OUTGOING_LABEL
      const url = PathBind.transform(this.context, path, { id: params.id })
      const response: any =  await $api.post(url, params.boxIds, { responseType: 'blob' })
      const file = new Blob([response], { type: 'application/pdf' })
      return URL.createObjectURL(file)
    } catch (error) {
      return ''
    }
  }
}
