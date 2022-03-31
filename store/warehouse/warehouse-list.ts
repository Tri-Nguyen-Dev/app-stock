import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class Warehouse extends VuexModule {
  private static readonly STATE_URL = {
    GET_WAREHOUSE: '/api/warehouse/list'
  }

  public warehouseList: [] = []

  @Mutation
  setWarehouseList(data: any) {
    this.warehouseList = data.items
  }

  @Action({ commit: 'setWarehouseList', rawError: true })
  async actWarehouseList(): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Warehouse.STATE_URL.GET_WAREHOUSE,
        { pageNumber: 1 }
      )
      const response = await $api.get(url, { params: { pageNumber: 1 }}) 
   
      return response.data
    } catch (error) {}
  }
}
