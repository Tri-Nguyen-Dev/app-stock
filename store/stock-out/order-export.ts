import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreExportOrder extends VuexModule {
  private static readonly STATE_URL = {
    EXPORT_RECEIPT: '/delivery-order/:id/pdf'
  }

  public orderUrl: any = {}

  @Mutation
  setOrderUrl(orderUrl: any) {
    this.orderUrl = orderUrl
  }

  @Action({ commit: 'setOrderUrl', rawError: true })
  async actGetOrderPdf(params: { id: string }): Promise<string | undefined> {
    if (!params.id) return ''
    try {
      const url = PathBind.transform(this.context, StoreExportOrder.STATE_URL.EXPORT_RECEIPT, params)
      const response: any = await $api.get(url, { responseType: 'blob' })
      const file = new Blob([response], { type: 'application/pdf' })
      return URL.createObjectURL(file)
    } catch (error) {
      return ''
    }
  }
}