import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class ItemsDetail extends VuexModule {
  private static readonly STATE_URL = {
    GET_ITEMS_DETAIL: '/stock-take/:id/detail-by-item',
    POST_ITEMS_DETAIL: '/stock-take/:id/submit'
  }

  public itemsList?: any[] = []
  public total: number
  public setItemsList?: any = []

  @Mutation
  setItemList(response: any) {
    this.itemsList = response?.items
    this.total = response?.total
  }

  @Mutation
  setDeliveryOrder(data: any) {
    this.setItemsList = data
  }

  @Action({ commit: 'setItemList', rawError: true })
  async actGetItemsList(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, ItemsDetail.STATE_URL.GET_ITEMS_DETAIL, { id: params.id } )
    const response: any = await $api.get(url, params.filter)
    return response.data
  }

  @Action({ commit: 'setDeliveryOrder', rawError: true })
  async actStockTakeItems(params: any): Promise<string | undefined> {
    try{
      const url = PathBind.transform(this.context, ItemsDetail.STATE_URL.POST_ITEMS_DETAIL, { id: params.id })
      const response = await $api.post(url, params.items, params.isDraft)
      return response.data
    } catch (error) {
    }
  }

}
