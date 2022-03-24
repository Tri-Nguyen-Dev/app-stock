import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '../../utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class Warehouse extends VuexModule {
  private static readonly STATE_URL = {
    GET_WAREHOUSE: '/warehouse/list'
  }

  public warehouseList: [] = []

  @Mutation
  setCategoryList(data: []) {
    this.warehouseList = data
  }

  @Action({ commit: 'setCategoryList', rawError: true })
  async actWarehouseList(): Promise<string | undefined> {
    const warehouseList = require('~/mocks/warehouse.json')
    try {
      const url = PathBind.transform(
        this.context,
        Warehouse.STATE_URL.GET_WAREHOUSE
      )
      const response = await $api.get(url)

      if (!response.data) {
        return warehouseList
      }

      return response.data
    } catch (error) {}
  }
}
