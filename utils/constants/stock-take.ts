export namespace StockTakeConstants {
  // -- [ Option List ] ------------------------------------------------
  export const STATUS_STOCK_TAKE_OPTIONS = [
    { name: 'Cancelled', value: 'CANCELLED' },
    { name: 'Completed', value: 'COMPLETED' },
    { name: 'New', value: 'NEW' },
    { name: 'In Progress', value: 'IN_PROGRESS' },
    { name: 'Approving', value: 'APPROVING' },
    { name: 'Approved', value: 'APPROVED' }
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

  export const RESULT_ITEM_STOCK_OPTIONS = [
    { name: 'Available', value: 'ITEM_STATUS_AVAILABLE' },
    { name: 'Disable', value: 'ITEM_STATUS_DISABLE' },
    { name: 'Draft', value: 'ITEM_STATUS_DRAFT' },
    { name: 'Unknown', value: 'ITEM_STATUS_UNKNOWN' },
    { name: 'Reported', value: 'ITEM_STATUS_REPORTED' }
  ]
}

export enum STOCK_TAKE_STATUS {
  NEW = 'NEW'
} 
