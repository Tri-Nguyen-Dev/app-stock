import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class Size extends VuexModule {
  private static readonly STATE_URL = {
    GET_SIZE: '/api/size/list'
  }

  public sizeList: [] = []

  @Mutation
  setSizeList(data: any) {
    this.sizeList = data.items
  }

  @Action({ commit: 'setSizeList', rawError: true })
  async actSizeList(): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Size.STATE_URL.GET_SIZE,
        { pageNumber: 1 }
      )
      const response = await $api.get(url, { params: { pageNumber: 1 }}) 
   
      return response.data
    } catch (error) {}
  }
}
