import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { Box } from '~/models/Box'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreBox extends VuexModule {
  private static readonly STATE_URL = {
    GET_BOX: '/box/list',
    DELETE_BOX: '/box/delete'
  }

  public boxList?: Box.Model[] = []
  public totalBoxRecords?: number = 0
  public boxListFilter?: Box.Model[] = undefined

  @Mutation
  setBoxList(response: any) {
    this.boxList = response?.items
    this.totalBoxRecords = response?.total
  }

  @Action({ commit: 'setBoxList', rawError: true })
  async actGetBoxList(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBox.STATE_URL.GET_BOX, params)
    const response: any = await $api.get(url, {params})
    return response
  }

  @Action({ rawError: true })
  async actDeleteBoxById({ids}): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBox.STATE_URL.DELETE_BOX, ids)
    const response: any = await $api.post(url, {ids})
    return response.data
  }
}
