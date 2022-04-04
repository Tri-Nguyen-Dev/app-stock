import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class Location extends VuexModule {
  private static readonly STATE_URL = {
    GET_LOCATION: '/api/location'
  }

  public locationList: [] = []

  @Mutation
  setLocationList(data: any) {
    this.locationList = data
  }

  @Action({ commit: 'setLocationList', rawError: true })
  async actLocationList(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, Location.STATE_URL.GET_LOCATION, params)
    const response: any = await $api.get(url, {params})
    return response
  }
}
