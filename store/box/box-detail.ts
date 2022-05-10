import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreBox extends VuexModule {
  private static readonly STATE_URL = {
    GET_BOX_DETAIL: '/box/:id/detail',
    UPDATE_BOX_DETAIL: '/box/:id/update',
    BOX_LOCATION_HISTORY: '/box/:id/location-history',
    BOX_HISTORY: '/box/:id/history'

  }

  public boxDetail?: {} = {}
  public locationHistory?: [] = []
  public boxHistory?: [] = []
  public totalItems?: number = 0
  public totalHistory?: number = 0
  public totalBoxHistory?: number = 0
  public updateSuccess?: boolean = false

  @Mutation
  setBoxDetail(data: any) {
    this.boxDetail = data
    this.totalItems = data.listStockWithAmount.length
  }

  @Mutation
  updateResponse(data: any) {
    if (data) {
      this.updateSuccess = !this.updateSuccess
    }
  }

  @Mutation
  boxLocationHistory(data: any) {
    this.locationHistory = data.items
    this.totalHistory = data.total
  }

  @Mutation
  getBoxHistory(data: any) {
    this.locationHistory = data.items
    this.totalBoxHistory = data.total
  }

  @Action({ commit: 'setBoxDetail', rawError: true })
  async actGetBoxDetail(params: { id: string }): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBox.STATE_URL.GET_BOX_DETAIL, params)
    const response: any = await $api.get(url)
    return response.data
  }

  @Action({ commit: 'updateResponse', rawError: true })
  async actUpdateBoxDetail(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBox.STATE_URL.UPDATE_BOX_DETAIL, { id: params.id })
    const response: any = await $api.post(url, { shelfBinId: params.shelfBinId })
    return response.data
  }

  @Action({ commit: 'boxLocationHistory', rawError: true })
  async actLocationHistory(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBox.STATE_URL.BOX_LOCATION_HISTORY, params)
    const response: any = await $api.get(url)
    return response.data
  }

  @Action({ commit: 'getBoxHistory', rawError: true })
  async actBoxHistory(id?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBox.STATE_URL.BOX_HISTORY,  id )
    const response: any = await $api.post(url, id )
    return response.data
  }

}
