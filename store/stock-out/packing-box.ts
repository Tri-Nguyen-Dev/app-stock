import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { PackingDetail } from '~/models/PackingDetail'
import { $api, PathBind } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StorePackingBox extends VuexModule {
  private static readonly STATE_URL = {
    GET_ORIGINAL_BOX: '/delivery-order/:id/list-original-box',
    GET_DELIVERY_ORDER: '/delivery-order/:id/detail'
  }

  public totalOriginalList?: number = 0
  public originalList: PackingDetail.OriginalBox[] = []
  public deliveryOrderDetail: any = {}

  @Mutation
  setListOriginal(data: any) {
    this.totalOriginalList = data?.total
    this.originalList = data?.items
  }

  @Mutation
  setDeliveryOrderDetail(data: any) {
    this.deliveryOrderDetail = data
  }

  @Action({ commit: 'setListOriginal', rawError: true })
  async actGetListOriginal(): Promise<any | undefined> {
    try {
      // const url = PathBind.transform(this.context, StorePackingBox.STATE_URL.GET_ORIGINAL_BOX, { id })
      // const response = await $api.get(url)
      // return response.data
      await new Promise(resolve => setTimeout(resolve, 1000))
      const data = {
        total: 12, 
        items: [
          {
            boxCode: 'B000000000001',
            items: [
              {
                barCode: '978020137962',
                sku: 'NVN030133',
                name: 'Dell Retro 1658',
                tag: 'No',
                quantity: 12,
                outGoingQuantity: 4
              },
              {
                barCode: '9268327894448',
                sku: 'NVN030133',
                name: 'Dell Retro 1658',
                tag: 'No',
                quantity: 12,
                outGoingQuantity: 5
              },
              {
                barCode: '6315937050764',
                sku: 'NVN030133',
                name: 'Dell Retro 1658',
                tag: 'No',
                quantity: 12,
                outGoingQuantity: 3
              }
            ]
          },
          {
            boxCode: 'B000000000002',
            items: [
              {
                barCode: '1930199863423',
                sku: 'NVN030133',
                name: 'Dell Retro 1658',
                tag: 'No',
                quantity: 12,
                outGoingQuantity: 8
              },
              {
                barCode: '7716239032165',
                sku: 'NVN030133',
                name: 'Dell Retro 1658',
                tag: 'No',
                quantity: 12,
                outGoingQuantity: 12
              },
              {
                barCode: '4981045513600',
                sku: 'NVN030133',
                name: 'Dell Retro 1658',
                tag: 'No',
                quantity: 12,
                outGoingQuantity: 2
              }
            ]
          },
          {
            boxCode: 'B000000000003',
            items: [
              {
                barCode: '4883855243756',
                sku: 'NVN030133',
                name: 'Dell Retro 1658',
                tag: 'No',
                quantity: 12,
                outGoingQuantity: 12
              },
              {
                barCode: '3457888996166',
                sku: 'NVN030133',
                name: 'Dell Retro 1658',
                tag: 'No',
                quantity: 12,
                outGoingQuantity: 12
              },
              {
                barCode: '3904388862847',
                sku: 'NVN030133',
                name: 'Dell Retro 1658',
                tag: 'No',
                quantity: 12,
                outGoingQuantity: 12
              }
            ]
          }
        ]      
      }
      return data
    } catch (error) {
      
    }
  }

  @Action({ commit: 'setDeliveryOrderDetail', rawError: true })
  async actGetDeliveryOrderDetail(id: any ): Promise<any | undefined> {
    try {
      const url = PathBind.transform(this.context, StorePackingBox.STATE_URL.GET_DELIVERY_ORDER, { id })
      const response = await $api.get(url)
      return response.data
    } catch (error) {
      
    }
  }
}
