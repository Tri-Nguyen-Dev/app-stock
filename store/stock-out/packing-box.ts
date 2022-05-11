import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { PackingDetail } from '~/models/PackingDetail'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StorePackingBox extends VuexModule {
  private static readonly STATE_URL = {
    GET_ORIGINAL_BOX: '/delivery-order/:id/list-original-box',
    GET_DELIVERY_ORDER: '/delivery-order/:id/detail',
    GET_BOX_LOCATION: '/location/suggest',
    GET_PACKING_DETAIL_BY_ID: '/delivery-order/:id/packing-detail'
  }

  public totalOriginalList?: number = 0
  public originalList: PackingDetail.OriginalBox[] = []
  public deliveryOrderDetail: any = {}
  public boxLocation: any[] = []
  public packingDetail: any = {}

  @Mutation
  setListOriginal(data: any) {
    this.totalOriginalList = data?.total
    this.originalList = data?.items
  }

  @Mutation
  setDeliveryOrderDetail(data: any) {
    this.deliveryOrderDetail = data
  }

  @Mutation
  setLocationSuggestion(data: any) {
    this.boxLocation = data
  }

  @Mutation
  setPackingDetail(data: any) {
    this.packingDetail = data
  }

  @Action({ commit: 'setListOriginal', rawError: true })
  async actGetListOriginal(id: any ): Promise<any | undefined> {
    try {
      const url = PathBind.transform(this.context, StorePackingBox.STATE_URL.GET_ORIGINAL_BOX, { id })
      const response = await $api.get(url)
      return response.data
    } catch (error) {

    }
  }

  @Action({ commit: 'setDeliveryOrderDetail', rawError: true })
  async actGetDeliveryOrderDetail(id: any ): Promise<any | undefined> {
    try {
      const url = PathBind.transform(this.context, StorePackingBox.STATE_URL.GET_DELIVERY_ORDER, { id })
      const response = await $api.get(url)
      return response.data
    } catch (error) {

    }
  }

  @Action({ commit: 'setLocationSuggestion', rawError: true })
  async actLocationSuggestion(data: any): Promise<string | undefined> {
    try{
      const url = PathBind.transform(this.context, StorePackingBox.STATE_URL.GET_BOX_LOCATION)
      const response = await $api.post(url, data)
      return response.data
    } catch (error) {}
  }

  @Action({ commit: 'setPackingDetail', rawError: true })
  async actGetPackingDetailById(id: any ): Promise<any | undefined> {
    try {
      const url = PathBind.transform(this.context, StorePackingBox.STATE_URL.GET_PACKING_DETAIL_BY_ID, { id })
      const response = await $api.get(url)
      return response.data
    } catch (error) {

    }
  }
}
