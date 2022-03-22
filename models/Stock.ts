export namespace StockModel {
  export interface GetStockParams {
    pageNumber?: number
    pageSize?: number
  }
  export class GetStockBody {
    keyword?: string
    warehouseId?: number
    code?: string
    status?: number
    categoryId?: number
  }

  export interface DeleteStockParams {
    stockIds?: string[]
  }
}
