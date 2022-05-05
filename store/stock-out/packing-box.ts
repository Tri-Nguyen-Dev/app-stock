import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { PackingDetail } from '~/models/PackingDetail'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StorePackingBox extends VuexModule {
  private static readonly STATE_URL = {
    GET_ORIGINAL_BOX: '/delivery-order/:id/list-original-box'
  }

  public totalOriginalList?: number = 0
  public originalList?: PackingDetail.OriginalBox

  @Mutation
  setListOriginal(data) {
    this.totalOriginalList = data?.total
    this.originalList = data?.items
  }

  @Action({ commit: 'setListOriginal', rawError: true })
  async actGetListOriginal(id: any ): Promise<string | undefined> {
    try {
      const url = PathBind.transform(this.context, StorePackingBox.STATE_URL.GET_ORIGINAL_BOX, { id })
      const response = await $api.get(url)
      if (!response.data) {
        return
      }
      return response.data
    } catch (error) {
      
    }
  }
}
