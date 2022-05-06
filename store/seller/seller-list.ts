import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class Seller extends VuexModule {
  private static readonly STATE_URL = {
    GET_SELLER: '/admin/user/list'
  }

  public sellerList: [] = []

  @Mutation
  setSellerList(data: any) {
    if(data) {
      this.sellerList = data
    }
  }

  @Action({ commit: 'setSellerList', rawError: true })
  async actSellerList(params?: any): Promise<any | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Seller.STATE_URL.GET_SELLER,
        params
      )
      const response = await $api.get(url, { params })
      if(response.data) {
        return response.data
      }
      return response
    } catch (error) {}
  }
}
