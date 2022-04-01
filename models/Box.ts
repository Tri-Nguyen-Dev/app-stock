export namespace Box {
  export interface Model {
    id: string,
    barcode: string,
    seller: {
      id: string,
      name: string,
      email: string
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
    location:{
      id:string,
      name:string
    },
    status?: boolean
  }
}
