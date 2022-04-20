import { Box as BoxModel} from './Box'
import { Item as ItemModel } from '~/models/Item'
export namespace Receipt{ 
  export interface Model{ 
    id:string,
    action: string,
    status: string,
    boxList: BoxModel.Model[],
    seller: string,
    driver: string
  }
  export interface Box {
		index: number,
		listItemInBox?: ItemModel.Model[]
  }
}