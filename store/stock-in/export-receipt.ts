import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreReceiptLable extends VuexModule {
  private static readonly STATE_URL = {
    EXPORT_RECEIPT: '/request/:id/pdf'
  }

  public receiptUrl: any = {}

  @Mutation
  setReceiptUrl(receiptUrl: any) {
    this.receiptUrl = receiptUrl
  }

  @Action({ commit: 'setReceiptUrl', rawError: true })
  async actGetReceiptLable(params: {id: string}): Promise<string | undefined> {
    if(!params.id) return ''
    try {
      const url = PathBind.transform(this.context, StoreReceiptLable.STATE_URL.EXPORT_RECEIPT, params)
      const response: any =  await $api.get(url, { responseType: 'blob' })
      const file = new Blob([response], { type: 'application/pdf' })
      return URL.createObjectURL(file)
    } catch (error) {
      return ''
    }
  }
}