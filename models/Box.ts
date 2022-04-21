import { Item as ItemModel } from './Item'
export namespace Box {
  export interface Model {
    id: string,
    code: string,
    receiptNoteId: string,
    creatorId: string,
    barCode: string,
    seller: {
      id: string,
      name: string,
      email: string,
      phone: string
    },
    createAt?: Date,
    updatedAt?: Date,
    length: number,
    width: number,
    height: number
    weight: number,
    warehouse: {
      id: string,
      name: string
    },
    location: {
      id: string,
      name: string
    },
    status?: boolean,
    deleted: boolean,
    inventoryFee: number,
    listStockWithAmount: ItemModel.Model,
    boxSize?: string
  }

  export enum BOX_SIZE {
    BOX_SIZE_SMALL = 'BOX_SIZE_SMALL',
    BOX_SIZE_MEDIUM = 'BOX_SIZE_MEDIUM',
    BOX_SIZE_BIG = 'BOX_SIZE_BIG'
  }
}
