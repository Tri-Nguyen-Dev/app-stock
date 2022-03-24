import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind} from '~/utils'
import { Box } from '~/models/Box'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreBox extends VuexModule {

  public boxData: Box.Model[] = []

  @Mutation
  setBoxData(boxData: []) {
    this.boxData = boxData
  }

  @Action({ commit: 'setBoxData', rawError: true })
  async actGetBoxData(): Promise<any | undefined> {
    const url = 'https://62315a6305f5f4d40d7871ae.mockapi.io/box'
    const response: Array<Box.Model[]> = await $api.get(url)
    return response
  }

  @Action({ rawError: true })
  async actDeleteBoxById(ids: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, "http://localhost:3000/delete", ids)
    const response: any = await $api.post(url, ids)
    return response
  }
}