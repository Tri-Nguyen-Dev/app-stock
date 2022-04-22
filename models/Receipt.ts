import { Box as BoxModel } from './Box'
import { Item as ItemModel } from '~/models/Item'

export namespace Receipt {

  export class Model {
    constructor() {
      this.boxList = []
    }

    id?: string
    action: string
    status: string
    boxList: BoxModel.Model[]
    // seller: string,
    // driver: string
  }

  export interface BoxLocation {
    id?: string,
    name: string
    index: number
  }

  export class Box {
    constructor() {
      this.listItemInBox = []
      this.index = 0
      this.location = {
        id: undefined,
        name: '',
        index: 0
      }
      this.boxSize = {
        id: 0
      }
    }

    qrCode?:string
    index: number
    listItemInBox: ItemModel.Model[]
    inventoryFee?: number
    boxSize: {
      id: number
      name?:string
      height?:number,
      width?: number,
      length?: number
    }

    id?:string
    status: string
    location: BoxLocation
    amount?:number
    sku?:string
    value?:number
  }

  export class ItemDraft {
    constructor() {
      this.stock = {
        id: ''
      }
    }

    stock: {
      id: string
    };

    value?: number
    sku?: string
    amount?: number
  }

  export class BoxDraft {
    constructor() {
      this.listStockWithAmount = []
      this.rackLocation = {
        id: undefined
      }
      this.boxSize = {
        id: 0
      }
    }

    inventoryFee?: number
    listStockWithAmount?: ItemDraft[]
    boxSize: {
      id: number
    }

    status?: string
    rackLocation: {
      id?: string
    }
  }

  export class CreateReceiptDraft {
    constructor() {
      this.boxList = []
      this.seller = { id: 1 }
      this.airtagE = { id: 1 }
      this.driver = { id: 2 }
      this.warehouse = { id: 1 }
    }

    action: string;
    status: string;
    boxList: BoxDraft[]
    seller: {
      id: number
    };

    airtagE: {
      id: number
    };

    driver: {
      id: number
    };

    warehouse: {
      id: number
    }
  }
}
