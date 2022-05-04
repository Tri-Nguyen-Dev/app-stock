import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreUser extends VuexModule {
  private static readonly STATE_URL = {
    USER_GET:    '/user/:id/detail',
    USER_CREATE: '/user/create'
  }

  public boxDetail?: {} = {}
  public totalItems?: number = 0
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

  @Action({ commit: 'setBoxDetail', rawError: true })
  async actGetBoxDetail(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreUser.STATE_URL.GET_BOX_DETAIL, params)
    const response: any = await $api.get(url)
    return response.data
  }

  @Action({ commit: 'updateResponse', rawError: true })
  async actUpdateBoxDetail(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreUser.STATE_URL.UPDATE_BOX_DETAIL, { id: params.id })
    const response: any = await $api.post(url, { shelfBinId: params.shelfBinId })
    return response.data
  }
}
