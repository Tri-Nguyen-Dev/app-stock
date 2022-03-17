import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '../../utils/commons/path-bind'
import { SuccessResponse } from '~/utils/response/success-response'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true,
})
export default class Warehouse extends VuexModule {
  private static readonly STATE_URL = {
    GET_WAREHOUSE: '/warehouse',
  }

  public warehouseList: [] = []

  @Mutation
  setCategoryList(data: []) {
    this.warehouseList = data
  }

  @Action({ commit: 'setCategoryList', rawError: true })
  async actWarehouseList(params?: any): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Warehouse.STATE_URL.GET_WAREHOUSE,
        params
      )
      const response: SuccessResponse<any> = await $api.get(url)

      if (!response.content) {
        const warehouseList = require('~/mocks/warehouse.json')
        return warehouseList
      }

      return response.content
    } catch (error) {}
  }
}
