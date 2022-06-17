import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreBoxStockTake extends VuexModule {
  private static readonly STATE_URL = {
    BOX_STOCK_TAKE_DETAIL: '/stock-take/:id/detail-by-box',
    SUBMIT_BOX_STOCK_TAKE_DETAIL: '/stock-take/:id/submit'
  }

  public total?: number = 0
  public boxStockTakeDetail: any = {}

  @Mutation
  setBoxStockTakeDetail({ data }) {
    this.total = data.total
    this.boxStockTakeDetail = data.items
  }

  @Action({ commit: 'setBoxStockTakeDetail', rawError: true })
  async actGetBoxStockTakeDetail(params: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBoxStockTake.STATE_URL.BOX_STOCK_TAKE_DETAIL,params)
    return await $api.get(url)
  }

  @Action({ rawError: true })
  async actSubmitBoxStockTakeDetail(params: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBoxStockTake.STATE_URL.SUBMIT_BOX_STOCK_TAKE_DETAIL,{ id: params.id })
    return await $api.post(url, params.submitData)
  }
}
