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
    SAVE_PACKING_ORDER: '/delivery-order/:id/set-delivery'
  }

  public totalOriginalList?: number = 0
  public originalList: PackingDetail.OriginalBox[] = []
  public deliveryOrderDetail: any = {}

  public boxLocation: any[] = []
  public idPackingDetail: any = null

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
  setIdPackingDetail(data: any) {
    this.idPackingDetail = data.id
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

  @Action({ commit: 'setIdPackingDetail', rawError: true })
  async actSavePackingDetail(data: any): Promise<string | undefined> {
    try{
      const url = PathBind.transform(this.context, StorePackingBox.STATE_URL.SAVE_PACKING_ORDER, { id: data.id })
      const response = await $api.post(url, { data: data.data })
      return response.data
    } catch (error) {}
  }
}
