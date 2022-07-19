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
      DELETE_BOX_SIZE: '/box-size/list/delete',
      CREATE_BOX_SIZE: '/box-size/create'
    }
    
    public boxSizeList: [] = []
    public newBoxSize: any = {}

    @Mutation
    setBoxSizeList(data: any) {
      this.boxSizeList = data.items
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

    @Action({ commit: 'setNewBoxSize', rawError: true })
    async actCreateNewBoxSize(params: any): Promise<string | undefined> {
      const url = PathBind.transform(
        this.context,
        BoxSize.STATE_URL.CREATE_BOX_SIZE
      )
      const response = await $api.post(url, params)
      return response.data
    }

    @Action({ rawError: true })
    async actUpdateBoxSize(params: any): Promise<string | undefined> {
      const url = PathBind.transform(
        this.context,
        BoxSize.STATE_URL.UPDATE_BOX_SIZE,
        { id: params.id }
      )
      const response: any = await $api.post(url, params)
      return response.data
    }

    @Action ({ rawError: true })
    async actDeletedBoxSizeByIds( ids?: string[] ): Promise<string | undefined> {
      // eslint-disable-next-line no-console
      console.log(ids)
      const url = PathBind.transform(
        this.context, 
        BoxSize.STATE_URL.DELETE_BOX_SIZE
      )
      const response: any = await $api.post(url, ids )
      if(!response.data) {
        return
      }
      return response.data 
    }
}