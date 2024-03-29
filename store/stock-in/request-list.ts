import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { Request } from '~/models/RequestList'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})
export default class StoreStockIn extends VuexModule {
  private static readonly STATE_URL = {
    GET_INCOMING_LIST: '/request/list',
    GET_TRANSFERING_LIST: '/request/list-transfer',
    DELETE_STOCK_IN: '/request/list/delete'
  }

  public stockIn?: Request.Model[] = []
  public total?: number = 0
  @Mutation
  setStockIn({ data }) {
    this.total = data.total
    this.stockIn = data.items
  }

  @Action({ commit: 'setStockIn', rawError: true })
  async actGetStockIn({ params, type }): Promise<string | undefined> {
    const path = type ? StoreStockIn.STATE_URL.GET_TRANSFERING_LIST : StoreStockIn.STATE_URL.GET_INCOMING_LIST
    const url = PathBind.transform(this.context, path, params)
    return await $api.get(url, { params })
  }

  @Action({ rawError: true })
  async actDeleteStockInByIds(
    { ids }
  ): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        StoreStockIn.STATE_URL.DELETE_STOCK_IN
      )
      const response = await $api.post(url, ids)
      if (!response.data) {
        return
      }
      return response.data
    } catch (error) {
    }
  }

}
