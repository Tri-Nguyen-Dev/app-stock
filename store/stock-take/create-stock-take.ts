import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreCreateStockTake extends VuexModule {
  private static readonly STATE_URL = {
    CREATE_STOCK_TAKE: '/stock-take/create'
  }

public stockTakeCreated : any = {}
  
  @Mutation
setStockTakeCreated(data) {
  this.stockTakeCreated = data
}

  @Action({ commit: 'setOutGoingList', rawError: true })
  async actOutGoingList(params?: any): Promise<string | undefined> {
    return await params
  }

  @Action({ commit: 'setStockTakeCreated', rawError: true })
  async actCreateStockTake(params: any): Promise<string | undefined> {
    try{
      const url = PathBind.transform(this.context, StoreCreateStockTake.STATE_URL.CREATE_STOCK_TAKE)
      const response = await $api.post(url, params)
      return response.data
    } catch (error) {}
  }

}
