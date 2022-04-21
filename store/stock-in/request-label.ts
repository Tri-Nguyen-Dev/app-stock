import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreRequestLabel extends VuexModule {
  private static readonly STATE_URL = {
    GET_LABEL: '/request/:id/label/:boxId'
  }

  public labelUrl: any = {}

  @Mutation
  setLabel(labelUrl: any) {
    this.labelUrl = labelUrl
  }

  @Action({ commit: 'setLabel', rawError: true })
  async actGetLabel(params: {id: number, boxId: number}): Promise<string | undefined> {
    if(!params.id || !params.boxId) return ''
    try {
      const url = PathBind.transform(this.context, StoreRequestLabel.STATE_URL.GET_LABEL, params)
      const response: any =  await $api.get(url, { responseType: 'blob' })
      const file = new Blob([response], { type: 'application/pdf' })
      return URL.createObjectURL(file)
    } catch (error) {
      return ''
    }
  }
}