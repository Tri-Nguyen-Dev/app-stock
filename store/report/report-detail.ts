import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreReportDetail extends VuexModule {
  private static readonly STATE_URL = {
    GET_REPORT_DETAIL: '/report/:id/detail'
  }

  public reportDetail?: any = {}

  @Mutation
  setReportDetail(data) {
    this.reportDetail = data
  }

  @Action({ commit: 'setReportDetail', rawError: true })
  async actGetReportDetail(id: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreReportDetail.STATE_URL.GET_REPORT_DETAIL, { id })
    return await $api.get(url)
  }
}
