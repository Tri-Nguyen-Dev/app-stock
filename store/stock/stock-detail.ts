import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { $api, PathBind } from '~/utils';

export namespace Stock {
  export class StockDetailId {
    id?: number
  }
}

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreStockDetail extends VuexModule {
  private static readonly STATE_URL = {
    GET_STOCK_DETAIL: '/api/stock/:id/detail',
    GET_ALL_BOX: '/submission/user/:userId/get-all-master-data'
  }

  public stockDetail: {} = {}

  public boxData: any = null

  @Mutation
  setBoxData(boxData: {}) {
    this.boxData = boxData;
  }

  @Mutation
  setStockDetail(stockDetail: {}) {
    this.stockDetail = stockDetail;
  }

  @Action({ commit: 'setStockDetail', rawError: true })
  async actGetStockDetail(params: Stock.StockDetailId): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreStockDetail.STATE_URL.GET_STOCK_DETAIL,params);
    return await $api.get(url);
  }

  @Action({ commit: 'setBoxData', rawError: true })
  async actGetBoxData(): Promise<string | undefined> {
    // const url = PathBind.transform(this.context, StoreBox.STATE_URL.GET_ALL_BOX)
    const url = 'https://62315a6305f5f4d40d7871ae.mockapi.io/box';
    return await $api.get(url);
  }

}
