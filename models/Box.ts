export namespace Box {
    export interface Model {
      id: string,
      code: string,
      seller: {
        id: string,
        name: string,
        email: string
      },
      createAt?: Date,
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