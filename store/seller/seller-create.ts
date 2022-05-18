import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class SellerCreate extends VuexModule {
  private static readonly STATE_URL = {
    CREATE_SELLER: '/staff/create-seller'
  }

  public newSeller: any = {}

  @Mutation
  setNewSeller(data: any) {
    if (data) {
      this.newSeller = data
    }
  }

  @Action({ commit: 'setNewSeller', rawError: true })
  async actCreateSeller(params?: any): Promise<any | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        SellerCreate.STATE_URL.CREATE_SELLER,
        params
      )
      const response = await $api.post(url, params)
      if (response.data) {
        return response.data
      }
      return response
    } catch (error) { }
  }
}
