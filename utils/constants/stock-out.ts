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
  SETTED = 'DELIVERY_ORDER_STATUS_SETTED',
  ACCEPTED = 'DELIVERY_ORDER_STATUS_ACCEPTED',
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
    { id: 5, label: 'Address' , value:'', type: INPUT_TYPE.Text },
    { id: 6, label: 'Email' , value:'', type: INPUT_TYPE.Text },
    { id: 7, label: 'Name' , value:'', type: INPUT_TYPE.Text },
    { id: 8, label: 'Phone' , value:'', type: INPUT_TYPE.Text }
  ],
  warehouse: [
    { id: 1, label: 'Name', disabled: false, staffDisable: true,  value:'', warehouseId: '', type: INPUT_TYPE.Dropdown },
    { id: 2, label: 'Email', value:'', disabled: false, staffDisable: true ,type: INPUT_TYPE.Text },
    { id: 3, label: 'Phone', value:'', disabled: false, staffDisable: true, type: INPUT_TYPE.Text }
  ],
  creator: [
    { id: 1, label: 'ID', value:'', disabled: false, type: INPUT_TYPE.Text },
    { id: 3, label: 'Email', value:'', disabled: false, type: INPUT_TYPE.Text },
    { id: 2, label: 'Name', value:'', disabled: false, type: INPUT_TYPE.Text },
    { id: 4, label: 'Phone', value:'', disabled: false, type: INPUT_TYPE.Text }
  ]
}
