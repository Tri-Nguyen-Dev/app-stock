export namespace StockModel {
  export interface GetStockParams {
    offset?: number,
    limit?: number,
    keyword: string,
    warehouseId: number,
    code: string,
    status: string,
    categoryId: number,
  }

  export interface DeleteStockParams {
    stockIds?: string[]
  }
}
