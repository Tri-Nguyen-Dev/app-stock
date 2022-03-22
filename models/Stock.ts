export namespace StockModel {
  export interface GetStockParams {
    pageNumber?: number
    pageSize?: number
  }
  export class Filter {
    name?: string
    warehouseId?: string
    barcode?: string
    status?: number
    categoryId?: string
  }

  export class StockBody {
    params?: StockModel.GetStockParams
    filter?: StockModel.Filter
  }

  export interface DeleteStockParams {
    stockIds?: string[]
  }
}
