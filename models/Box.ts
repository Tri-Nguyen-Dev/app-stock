import {Item as ItemModel } from './Item'
export namespace Box {
  export interface Model {
    id: string,
    barCode: string,
    request: {
      seller: {
        id: string,
        email: string
      },
      warehouse: {
        id: string,
        name: string
      }
    }
    createdAt?: Date,
    updatedAt?: Date,
    length: number,
    width: number,
    height: number
    weight: number,
    rackLocation: {
      id: string,
      name: string
    },
    location:{
      id:string,
      name:string
    },
    status?: boolean,
    deleted: boolean,
    inventoryFee: number,
    listStockWithAmount: ItemModel.Model,
    boxSize?: string
  }
}
