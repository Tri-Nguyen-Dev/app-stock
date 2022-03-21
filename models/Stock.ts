export namespace StockModel {
  export interface GetStockParams {
    pageNumber?: number
    pageSize?: number
  }
  export interface DeleteStockParams {
    stockIds?: string[]
  }
}
