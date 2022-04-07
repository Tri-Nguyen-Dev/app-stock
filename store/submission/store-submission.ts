import { Mutation, VuexModule, Action, Module } from 'vuex-module-decorators';
import { $api } from '~/utils'

export namespace Submission {
    export class SubmissionModel {
        id?: number
        image?: string
        barcode?:string
        sku?: string
        name?: string
        quantity?: number
        size?: number
        weight?: number
        category?: string
    }
}

@Module({
    stateFactory: true,
    namespaced: true
  })

export default class StoreSubmission extends VuexModule {
    private static readonly STATE_URL =  {
        GET_MASTER_DATA: 'https://6232bf088364d63035c2e14e.mockapi.io/boxtest'
        
    }

    public boxTest: any = []

    @Mutation
    getMasterDataBoxList(getMasterData: []) {
        this.boxTest = getMasterData
    }

    @Action({ commit: 'getMasterDataBoxList', rawError: true })
    async actGetMasterData(): Promise<string | undefined> {
    //   const url = PathBind.transform(this.context, StoreSubmission.STATE_URL.GET_MASTER_DATA, submission)
    const url ='https://6232bf088364d63035c2e14e.mockapi.io/boxtest'
      const response: any = await $api.get(url)
      return response
    }
}