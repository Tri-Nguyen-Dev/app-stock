import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators';
import { $api, PathBind } from '~/utils';
@Module({
    stateFactory: true,
    namespaced: true
})

export default class StoreBox extends VuexModule {
  private static readonly STATE_URL = {
      GET_BOX_DETAIL: '/api/box/:id/detail'
  }

  public stockList?: any = []
  public boxDetail?: {} = {}
  public totalItems?: number = 0

  @Mutation
  setBoxDetail(data: any) {
      this.boxDetail = data;
      this.totalItems = data.listStockWithAmount.length;
  }

  @Action({ commit: 'setBoxDetail', rawError: true })
  async actGetBoxDetail(params?: any): Promise<string | undefined> {
      const url = PathBind.transform(this.context, StoreBox.STATE_URL.GET_BOX_DETAIL, params);
      const response: any = await $api.get(url);
      return response.data;
  }
}
