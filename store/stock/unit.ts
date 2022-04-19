import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreUnit extends VuexModule {
  private static readonly STATE_URL = {
    GET_UNIT_LIST: '/unit/list'
  }

  public unitList?: [] = []

  @Mutation
  setUnitList(data:any) {
    this.unitList = data.items
  }

  @Action({commit: 'setUnitList', rawError: true })
  async actUnitList(): Promise<string | undefined> {
    try {
      const url = PathBind.transform(this.context, StoreUnit.STATE_URL.GET_UNIT_LIST)
      const response = await $api.get(url)
      return response.data
    } catch (error) {}
  }
}
