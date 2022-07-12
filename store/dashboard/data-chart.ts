import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreDashboard extends VuexModule {
  private static readonly STATE_URL = {
    BOX_ITEM: '/dashboard/box-item',
    DELIVERY_CHART: '/dashboard/delivery',
    ACTIVITY_CHART: '/dashboard/activities',
    SELLER_CHART: '/dashboard/sellers',
    CATEGORY_CHART: '/dashboard/category',
    CAPACITY_CHART: '/dashboard/capacity'
  }

  public boxItem?: any = null
  public delivery?: any = null
  public activities?: any = null
  public sellers?: any = null
  public category?: any = null
  public capacity?: any = null

  @Mutation
  setBoxItem(data: any) {
    this.boxItem = data
  }

  @Mutation
  setDelivery(data: any) {
    this.delivery = data?.items
  }

  @Mutation
  setActivities(data: any) {
    this.activities = data?.items
  }

  @Mutation
  setSellers(data: any) {
    this.sellers = data?.items
  }

  @Mutation
  setCategory(data: any) {
    this.category = data
  }

  @Mutation
  setCapacity(data: any) {
    this.capacity = data
  }

  @Action({ commit: 'setBoxItem', rawError: true })
  async actGetBoxItem(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreDashboard.STATE_URL.BOX_ITEM, params)
    const response: any = await $api.get(url, { params })
    return response.data
  }
  
  @Action({ commit: 'setDelivery', rawError: true })
  async actGetDelivery(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreDashboard.STATE_URL.DELIVERY_CHART, params)
    const response: any = await $api.get(url, { params })
    return response.data
  }

  @Action({ commit: 'setActivities', rawError: true })
  async actActivities(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreDashboard.STATE_URL.ACTIVITY_CHART, params)
    const response: any = await $api.get(url, { params })
    return response.data
  }

  @Action({ commit: 'setSellers', rawError: true })
  async actGetSellers(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreDashboard.STATE_URL.SELLER_CHART, params)
    const response: any = await $api.get(url, { params })
    return response.data
  }

  @Action({ commit: 'setCategory', rawError: true })
  async actGetCategory(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreDashboard.STATE_URL.CATEGORY_CHART, params)
    const response: any = await $api.get(url, { params })
    return response.data
  }

  @Action({ commit: 'setCapacity', rawError: true })
  async actGetCapacity(params?: any): Promise<string | undefined> {
    const url = PathBind.transform(this.context, StoreDashboard.STATE_URL.CAPACITY_CHART, params)
    const response: any = await $api.get(url, { params })
    return response.data
  }
}
