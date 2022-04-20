import { Box as BoxModel} from './Box'
import { Item as ItemModel } from '~/models/Item'
export namespace Receipt{ 
  
  export class Model{ 
    constructor(){
      this.boxList = []
    }

    id?:string
    action: string
    status: string
    boxList: BoxModel.Model[]
    // seller: string,
    // driver: string
  }
  export class Box {
    constructor(){
      this.listItemInBox = []
      this.index = 0
    }

		index: number
		listItemInBox: ItemModel.Model[]
    inventoryFee?: number
    boxSize: string
    status: string
  }

  export  class ItemDraft{   
    constructor(){
      this.stock = {
        id:''
      }
    }

      stock:{
          id: string
      };

      value?: number
      sku?: string
      amount?: number  
  }

  export class BoxDraft {
    constructor(){
      this.listStockWithAmount = []
    }

    inventoryFee?: number
    listStockWithAmount?: ItemDraft[]
    boxSize?: string
    status?: string
    rackLocation?: {
        id: 1
    }
  }
  export class CreateReceiptDraft {   
    constructor (){
      this.boxList = []
    }

    action: string;
    status: string;
    boxList: BoxDraft[]
    seller: {
        id: 1
    };

    airtagE:{
        id: 1
    };

    driver: {
        id: 2
    };

    warehouse: {
        id: 1
    }
  }

  export interface BoxLocation {
    id: string,
    name:string
    index: number
  }
}