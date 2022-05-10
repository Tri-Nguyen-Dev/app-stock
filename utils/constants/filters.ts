export namespace FilterConstants {
  // -- [ Option Maps ] ------------------------------------------------
  export const BOX_SIZE_MAP = new Map<string, string>([
    ['BOX_SIZE_BIG', 'Big'],
    ['BOX_SIZE_MEDIUM', 'Medium'],
    ['BOX_SIZE_SMALL', 'Small']
  ])
  export const STATUS_MAP = new Map<string, string>([
    ['BOX_STATUS_AVAILABLE', 'AVAILABLE'],
    ['BOX_TRANFERING', 'TRANFERING'],
    ['BOX_OUTGOING', 'OUTGOING']
  ])
  export const STATUS_REQUEST_MAP = new Map<string, string>([
    ['REQUEST_STATUS_SAVED', 'SAVED'],
    ['REQUEST_STATUS_DRAFT', 'DRAFT']
  ])
  export const STATUS_HISTORY_MAP = new Map<string, string>([
    ['REQUEST_STATUS_SAVED', 'SAVED'],
    ['REQUEST_STATUS_DRAFT', 'DRAFT']
  ])
}
