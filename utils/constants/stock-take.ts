export namespace StockTakeConstants {
  // -- [ Option List ] ------------------------------------------------
  export const STATUS_STOCK_TAKE_OPTIONS = [
    { name: 'Cancelled', value: 'CANCELLED' },
    { name: 'Completed', value: 'COMPLETED' },
    { name: 'New', value: 'NEW' },
    { name: 'In Progress', value: 'IN_PROGRESS' },
    { name: 'Approving', value: 'APPROVING' },
    { name: 'Approved', value: 'APPROVED' },
    { name: 'Save Draft', value: 'SAVE_DRAFT' }
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

export enum STOCK_TAKE_STATUS {
  NEW = 'NEW'
} 
