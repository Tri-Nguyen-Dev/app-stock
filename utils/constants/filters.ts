export namespace FilterConstants {
  // -- [ Option Maps ] ------------------------------------------------
  export const BOX_SIZE_MAP = new Map<string, string>([
    ['BOX_SIZE_BIG', 'Big'],
    ['BOX_SIZE_MEDIUM', 'Medium'],
    ['BOX_SIZE_SMALL', 'Small']
  ])
  export const STATUS_MAP = new Map<string, string>([
    ['BOX_STATUS_AVAILABLE', 'AVAILABLE'],
    ['BOX_STATUS_OUTGOING', 'OUTGOING'],
    ['BOX_STATUS_DRAFT', 'DRAFT'],
    ['BOX_STATUS_DISABLE', 'DISABLE']
  ])
  export const STATUS_REQUEST_MAP = new Map<string, string>([
    ['REQUEST_STATUS_SAVED', 'SAVED'],
    ['REQUEST_STATUS_DRAFT', 'DRAFT']
  ])
  export const STATUS_HISTORY_MAP = new Map<string, string>([
    ['REQUEST_ACTION_TO_TRANSFERRING_BOX', 'TRANSFERRING'],
    ['REQUEST_ACTION_TO_OUTGOING_BOX', 'OUTGOING']
  ])
}
