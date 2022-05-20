import { required } from 'vuelidate/lib/validators'

export enum STOCK_OUT_ACTION {
  ORDER_DETAIL = 'ORDER_DETAIL',
  ORDER_PICK_ITEM = 'ORDER_PICK_ITEM',
}

export enum ORDER_STATUS {
  NEW = 'DELIVERY_ORDER_STATUS_NEW',
  IN_PROGRESS = 'DELIVERY_ORDER_STATUS_IN_PROGRESS',
  READY = 'DELIVERY_ORDER_STATUS_READY',
  CANCELED = 'DELIVERY_ORDER_STATUS_CANCELLED',
  DELIVERING = 'DELIVERY_ORDER_STATUS_DELIVERING',
  DELIVERED = 'DELIVERY_ORDER_STATUS_DELIVERED',
  RETURNE = 'DELIVERY_ORDER_STATUS_RETURNE'
}

export enum INPUT_TYPE {
  Text,
  AutoComplete,
  Dropdown
}

export const INFORMATION = {
  seller: [
    { id: 1, label: 'Email' , value: '', disabled: false, type: INPUT_TYPE.AutoComplete, validator: required },
    { id: 3, label: 'Name', value:'', disabled: false, type: INPUT_TYPE.Text, validator: required },
    { id: 4, label: 'Phone', value:'', disabled: false, type: INPUT_TYPE.Text, validator: required }
  ],
  receiver:  [
    { id: 5, label: 'Address' , value:'' },
    { id: 6, label: 'Email' , value:'' },
    { id: 7, label: 'Name' , value:'' },
    { id: 8, label: 'Phone' , value:'' }
  ],
  warehouse: [
    { id: 1, label: 'Name', options:'options', disabled: false,  value:'', warehouseId: '' },
    { id: 2, label: 'Email', value:'', disabled: false },
    { id: 3, label: 'Phone', value:'', disabled: false }
  ],
  creator: [
    { id: 1, label: 'ID', value:'', disabled: false },
    { id: 3, label: 'Email', value:'', disabled: false },
    { id: 2, label: 'Name', value:'', disabled: false },
    { id: 4, label: 'Phone', value:'', disabled: false }
  ]
}
