import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreReport extends VuexModule {
  private static readonly STATE_URL = {
    GET_REPORT: '/report/list',
    DELETE_REPORT: '/report/list/delete',
    CREATE_REPORT: '/report/create'
  }

  public reportList?: any[] = []
  public totalReportRecords?: number = 0
  public listBoxTakeNote: any = []
  public reportListFilter?: any[] = undefined
  public reportCreate: any = {}

  @Mutation
  setReportList(response: any) {
    this.reportList = response?.items
    this.totalReportRecords = response?.total
  }

  @Mutation
  setReportCreate(data: any) {
    this.reportCreate = data
  }

  @Mutation
  setListBoxTakeNote(data: any) {
    this.listBoxTakeNote = data
  }

  @Mutation
  resetListBoxTakeNote(data: any) {
    this.listBoxTakeNote = data
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
    const response: any = await $api.post(url, ids)
    return response.data
  }

  @Action({ commit: 'setReportCreate',rawError: true })
  async actCreateReport( data ): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreReport.STATE_URL.CREATE_REPORT)
    const response: any = await $api.post(url,  data )
    return response.data
  }

  @Action({ commit: 'resetListBoxTakeNote',rawError: true })
  actResetStockTake(  ) {
    return []
  }
}
