import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreMasterData extends VuexModule {

  public masterData: any = []

  @Mutation
  setMasterData(masterData: []) {
    this.masterData = masterData
  }

  @Action({ commit: 'setMasterData', rawError: true })
  async actGetMasterData(): Promise<any | undefined> {
    const url = 'https://62315a6305f5f4d40d7871ae.mockapi.io/master-data'
    const response: any = await $api.get(url)
    return response[0].masterData
  }
}