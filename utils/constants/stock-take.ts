export namespace StockTakeConstants {
  // -- [ Option List ] ------------------------------------------------
  export enum StatusStockTake {
    NEW = 2,
    IN_PROGRESS = 3,
    CANCELLED = 0,
    COMPLETED = 1
  }

  export const STATUS_STOCK_TAKE_OPTIONS = [
    { name: 'Cancelled', value: StatusStockTake.CANCELLED },
    { name: 'Completed', value: StatusStockTake.COMPLETED },
    { name: 'New', value: StatusStockTake.NEW },
    { name: 'In Progress', value: StatusStockTake.IN_PROGRESS }
  ]

  export const TYPE_STOCK_TAKE_OPTIONS = [
    { name: 'Box', value: 'BOX' },
    { name: 'Item', value: 'ITEM' }
  ]

  export const RESULT_STOCK_TAKE_OPTIONS = [
    { name: 'Ng', value: 'NG' },
    { name: 'Ok', value: 'OK' },
    { name: 'Waiting', value: 'WAITING' }
  ]
}
