import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class Location extends VuexModule {
  private static readonly STATE_URL = {
    GET_LOCATION: '/api/location/list'
  }

  public locationList: [] = []

  @Mutation
  setLocationList(data: any) {
    this.locationList = data.items
  }

  @Action({ commit: 'setLocationList', rawError: true })
  async actLocationList(): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Location.STATE_URL.GET_LOCATION,
        { pageNumber: 1 }
      )
      const response = await $api.get(url, { params: { pageNumber: 1 }}) 
   
      return response.data
    } catch (error) {}
  }
}
