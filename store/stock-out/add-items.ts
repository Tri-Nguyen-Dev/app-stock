import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreInventory extends VuexModule {
  private static readonly STATE_URL = {
    GET_INVENTORY: '/box/list'
  }

  public inventoryStore?: any = []
  public total?: number = 0

  @Mutation
  setInventoryList(response: any) {
    this.inventoryStore = response?.items
    this.total = response?.total
  }

  @Action({ commit: 'setInventoryList', rawError: true })
  async actGetInventoryList(params?: any): Promise<any | undefined> {
    const url = PathBind.transform(this.context, StoreInventory.STATE_URL.GET_INVENTORY, params)
    try {
      await $api.get(url, { params })
    } catch (error) {
    }
    const inventoryList = { 0: [{
      id: 1,
      inventory: 12,
      image:'',
      barCode: '2364346374634',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-27T09:42:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 2,
      inventory: 34,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '823472364',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 3,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 4,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 5,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 6,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 7,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 8,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 9,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 10,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 11,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 12,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    }], 1: [{
      id: 14,
      inventory: 12,
      image:'',
      barCode: '2374843246',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-27T09:42:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 15,
      inventory: 34,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23423756',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 16,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 17,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 18,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 19,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 20,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 21,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 22,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 23,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 24,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 25,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    },{
      id: 26,
      inventory: 19,
      image:'65373131653135302d643336342d333937322d383337392d313766663631613632383030.png',
      barCode: '23435234',
      sku: 'NVN0303113',
      sellerEmail: 'namlcp@rikkeisoft.com',
      boxCode: 'B022222222222',
      receiptId: 'RN28474743',
      stockInTime: '2022-04-21T09:56:15.490+00:00',
      status: 'AVAILABLE'
    }],
    total: 24
    }
    return { items: inventoryList[`${params.pageNumber}`], total: 24 }
  }
}
