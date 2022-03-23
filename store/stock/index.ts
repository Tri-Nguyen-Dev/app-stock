import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { Stock } from '~/models/Stock';
import { SuccessResponse } from '~/utils/response/success-response'
import { $api, PathBind } from '~/utils'


export namespace StockStoreModel {

  export interface Pagination {
    pageNumber?: number,
    pageSize?: number,
    total?: number
  }

  export interface ResponseContent {
    data?: Stock.Model[],
    pagination?: StockStoreModel.Pagination
  }

  export interface ParamStock {
    pageNumber?: number,
    pageSize?: number
  }

  export interface GetStock {
    params?: StockStoreModel.ParamStock,
    filter?:  {
      name?: string
      warehouseId?: string
      barcode?: string
      status?: number
      categoryIds?: string[]
    }
  }
}

@Module({
  stateFactory: true,
  namespaced: true,
})

export default class StoreStock extends VuexModule {
  private static readonly STATE_URL = {
    GET_STOCK: '/product/list',
  }

  public stockList?: Stock.Model[] = []
  public pagination?: StockStoreModel.Pagination = {}

  @Mutation
  setProductList(content: StockStoreModel.ResponseContent ) {
    this.stockList = content.data
    this.pagination = content.pagination
  }

  @Action({ commit: 'setProductList', rawError: true })
  async actGetProductList(
    data?: StockStoreModel.GetStock
  ): Promise<string | undefined> {
    const stockList = require('~/mocks/products.json')  
    try {
      const url = PathBind.transform(
        this.context,
        StoreStock.STATE_URL.GET_STOCK,
        data?.params
      )
      const response: SuccessResponse<any> = await $api.post(url, data?.filter, { params: data?.params })

      if (!response.content) {
        return stockList.content
      }

      return response.content
    } catch (error) {
      return stockList
    }
  }
}
