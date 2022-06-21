import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreBoxStockTake extends VuexModule {
  private static readonly STATE_URL = {
    BOX_STOCK_TAKE_DETAIL: '/stock-take/:id/detail',
    SUBMIT_BOX_STOCK_TAKE_DETAIL: '/stock-take/:id/submit?isDraft=:isDraft',
    ASSIGN_BOX_STOCK_TAKE: '/stock-take/assign'
  }

  public boxStockTakeDetail: any = {}

  @Mutation
  setBoxStockTakeDetail(boxStockTakeDetail:any) {
    this.boxStockTakeDetail = boxStockTakeDetail.data
  }

  @Action({ commit: 'setBoxStockTakeDetail', rawError: true })
  async actGetBoxStockTakeDetail(params: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBoxStockTake.STATE_URL.BOX_STOCK_TAKE_DETAIL,params)
    return await $api.get(url)
  }

  @Action({ rawError: true })
  async actSubmitBoxStockTakeDetail(params: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBoxStockTake.STATE_URL.SUBMIT_BOX_STOCK_TAKE_DETAIL,{ id: params.id, isDraft: params.isDraft })
    return await $api.post(url, params.submitData)
  }

  @Action({ rawError: true })
  async actGetAssignBoxStockTake(params: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreBoxStockTake.STATE_URL.ASSIGN_BOX_STOCK_TAKE)
    return await $api.post(url, params)
  }
}
