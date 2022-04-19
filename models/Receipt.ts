import {Box as BoxModel} from './Box'
export namespace Receipt{ 
  export interface Model{ 
    id:string,
    action: string,
    status: string,
    boxList: BoxModel.Model[],
    seller: string,
    driver: string
  }
}