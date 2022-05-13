
export namespace PackingDetail { 
  export interface OriginalBox {
    boxCode?: string,
    items?: PackingDetail.StockBoxOriginal[]
  }
  
  export interface StockBoxOriginal {
    barCode?: string,
    sku?: string,
    name?: string,
    airtag?: string,
    quantity?: number | string,
    outGoingQuantity?: number | string
  }
}
