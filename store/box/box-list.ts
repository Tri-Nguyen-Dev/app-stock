import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { Box } from '~/models/Box'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreBox extends VuexModule {
  private static readonly STATE_URL = {
    GET_BOX: '/api/box/list',
    GET_BOX_FILTER: '/api/box'
  }

  public boxList?: Box.Model[] = []
  public totalBoxRecords?: number = 0
  public boxListFilter?: Box.Model[] = undefined

  @Mutation
  setBoxList(data: any) {
    this.boxList = data.items
    this.totalBoxRecords = data.total
  }

  @Mutation
  setBoxListFilter(data: any) {
    this.boxListFilter = data
  }

  @Action({ commit: 'setBoxList', rawError: true })
  async actGetBoxList(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBox.STATE_URL.GET_BOX, params)
    const response: any = await $api.get(url, {params})
    return response.data
  }

  @Action({ commit: 'setBoxListFilter', rawError: true })
  async actGetBoxFilter(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBox.STATE_URL.GET_BOX_FILTER, params)
    const response: any = await $api.get(url, {params})
    return response
  }
}
