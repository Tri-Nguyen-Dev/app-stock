import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreReportDetail extends VuexModule {
  private static readonly STATE_URL = {
    GET_REPORT_DETAIL: '/report/:id/detail',
    EXPORT_RECEIPT: '/stock-take/:id/pdf'
  }

  public reportDetail?: any = {}
  public reportUrl: any = {}

  @Mutation
  setReportDetail({ data }) {
    this.reportDetail = data
  }

  @Mutation
  setReportUrl(ReportUrl: any) {
    this.reportUrl = ReportUrl
  }

  @Action({ commit: 'setReportDetail', rawError: true })
  async actGetReportDetail(id: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreReportDetail.STATE_URL.GET_REPORT_DETAIL, { id })
    return await $api.get(url)
  }

  @Action({ commit: 'setReportUrl', rawError: true })
  async actGetReceiptLable(params: {id: string}): Promise<string | undefined> {
    if(!params.id) return ''
    try {
      const url = PathBind.transform(this.context, StoreReportDetail.STATE_URL.EXPORT_RECEIPT, params)
      const response: any =  await $api.get(url, { responseType: 'blob' })
      const file = new Blob([response], { type: 'application/pdf' })
      return URL.createObjectURL(file)
    } catch (error) {
      return ''
    }
  }
}
