import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
// import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreCreateReceipt extends VuexModule {
  private static readonly STATE_URL = {
  }

  public total?: number = 0
  public listInfor1: any = {};
  
  @Mutation
  setStockIn(data) {
    this.listInfor1 = data
  }

  @Action({ commit: 'setStockIn', rawError: true })
  async actGetCreateOrder( obj: any ): Promise<string | undefined> {
    return await obj
  }

}
