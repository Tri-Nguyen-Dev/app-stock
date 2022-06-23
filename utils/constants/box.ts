export const ITEM_BOX_DETAIL = [
  { id: 1, icon: 'receipt', label: 'Receipt note ID' },
  { id: 2, icon: 'tag-user', label: 'Create ID' },
  { id: 4, icon: 'warehouse', label: 'Warehouse' },
  { id: 5, icon: 'location-2', label: 'Location' },
  { id: 6, icon: 'calendar', label: 'Create Time' },
  { id: 7, icon: 'frame', label: 'Box Items' },
  { id: 8, icon: 'dollar-square-2', label: 'Estimated inventory Fee' },
  { id: 9, icon: 'resize', label: 'Box Size:' }
]

export const ITEM_SELLER_INFO = [
  { id: 1, icon: 'sender-name', label: 'Sender' },
  { id: 2, icon: 'sender-email', label: 'Email' },
  { id: 3, icon: 'sender-phone', label: 'Phone number' }
]

export enum BOX_STATUS  {
  BOX_STATUS_AVAILABLE = 'BOX_STATUS_AVAILABLE',
  BOX_STATUS_OUTGOING = 'BOX_STATUS_OUTGOING',
  BOX_STATUS_DRAFT = 'BOX_STATUS_DRAFT',
  BOX_STATUS_DISABLE= 'BOX_STATUS_DISABLE',
  BOX_STATUS_REPORTED= 'BOX_STATUS_REPORTED',
}
