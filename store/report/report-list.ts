import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { Report } from '~/models/Report'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreReport extends VuexModule {
  private static readonly STATE_URL = {
    GET_REPORT: '/report/list',
    DELETE_REPORT: '/report/delete'
  }

  public reportList?: Report.Model[] = []
  public totalReportRecords?: number = 0
  public reportListFilter?: Report.Model[] = undefined
  public reportTransfer: any = [];

  @Mutation
  setReportList(response: any) {
    this.reportList = response?.items
    this.totalReportRecords = response?.total
  }

  @Mutation
  setReportTransfer(data: any) {
    this.reportTransfer = data
  }

  @Action({ commit: 'setReportList', rawError: true })
  async actGetReportList(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreReport.STATE_URL.GET_REPORT, params)
    const response: any = await $api.get(url, { params })
    return response.data
  }

  @Action({ rawError: true })
  async actDeleteReportById({ ids }): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreReport.STATE_URL.DELETE_REPORT, ids)
    const response: any = await $api.post(url, { ids })
    return response.data
  }

  @Action({ commit: 'setReportTransfer', rawError: true })
  actAddTransferReport( reportTransfer: any ): Promise<string | undefined> {
    return reportTransfer
  }
}
