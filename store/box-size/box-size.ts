import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'
import { BoxSize as BoxSizeModel } from '~/models/BoxSize'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class BoxSize extends VuexModule {
    private static readonly STATE_URL = {
      GET_BOX_SIZE: '/box-size/list',
      GET_BOX_SIZE_DETAIL: '/box-size/:id/detail',
      UPDATE_BOX_SIZE: '/box-size/:id/update',
      DELETE_BOX_SIZE: '/box-size/:id/delete',
      CREATE_BOX_SIZE: '/box-size/create'
    }
    
    public boxSizeList: [] = []
    public newBoxSize: any = {}

    @Mutation
    setBoxSizeList(data: any) {
      this.boxSizeList = data
    }

    @Mutation
    setNewBoxSize(newBoxSize: BoxSizeModel.CreateOrUpdateBoxSize){
      this.newBoxSize = newBoxSize
    }

    @Action({ commit: 'setBoxSizeList', rawError: true })
    async actBoxSizeList() {
      const url = PathBind.transform(
        this.context,
        BoxSize.STATE_URL.GET_BOX_SIZE
      )
      const response = await $api.get(url)
      return response.data
    }
}