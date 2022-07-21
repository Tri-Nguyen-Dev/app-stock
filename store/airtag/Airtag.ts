import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})
export default class Airtag extends VuexModule {
  private static readonly STATE_URL = {
    GET_AIRTAGS: '/airtag/list',
    DELETE_AIRTAG: '/airtag/list/delete',
    CREATE_AIRTAG: '/airtag/create',
    UPDATE_AIRTAG: '/airtag/:id/update'
  }

  public airtagList: any = []
  public airtagTotal: any = []
  public newAirtagDetail: any = {}

  @Mutation
  setAirtagList(data: any) {
    this.airtagList = data.items
    this.airtagTotal = data.total
  }

  @Action({ commit: 'setAirtagList', rawError: true })
  async actAirtagList(params?: any): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Airtag.STATE_URL.GET_AIRTAGS,
        params
      )
      const response = await $api.get(url, { params })
      return response.data
    } catch (error) {}
  }

  @Action({ rawError: true })
  async actDeleteAirtag(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(
      this.context,
      Airtag.STATE_URL.DELETE_AIRTAG
    )
    const response: any = await $api.post(url, params)
    return response.data
  }

  @Action({ rawError: true })
  async actCreateNewAirtag(params: any): Promise<string | undefined> {
    const url = PathBind.transform(
      this.context,
      Airtag.STATE_URL.CREATE_AIRTAG
    )
    const response = await $api.post(url, params)
    return response.data
  }

  @Action({ rawError: true })
  async actUpdateAirtag(params: any): Promise<string | undefined> {
    const url = PathBind.transform(
      this.context,
      Airtag.STATE_URL.UPDATE_AIRTAG,
      { id: params.id }
    )
    const response: any = await $api.post(url, params)
    return response.data
  }
}
